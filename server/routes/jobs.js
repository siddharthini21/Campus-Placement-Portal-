const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/user");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/create", authMiddleware, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const { title, company, description, location, salary, minCgpa, eligibleDepartments, deadline } = req.body;

    const job = new Job({
      title,
      company,
      description,
      location,
      salary,
      postedBy: req.user.id,
      minCgpa: minCgpa || 0,
      eligibleDepartments: eligibleDepartments || [],
      deadline: deadline || null,
    });

    await job.save();

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email").sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/apply", authMiddleware, authorizeRoles("student"), async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(400).json({ message: "Application deadline has passed" });
    }

    const student = await User.findById(req.user.id);

    if (job.minCgpa && student.cgpa < job.minCgpa) {
      return res.status(400).json({
        message: `You do not meet the minimum CGPA requirement (${job.minCgpa})`,
      });
    }

    if (
      job.eligibleDepartments &&
      job.eligibleDepartments.length > 0 &&
      !job.eligibleDepartments.includes(student.department)
    ) {
      return res.status(400).json({
        message: "Your department is not eligible for this job",
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      student: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = new Application({
      job: jobId,
      student: req.user.id,
    });

    await application.save();

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-applications", authMiddleware, authorizeRoles("student"), async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id }).populate("job");
    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const role = req.user.role;

    if (role === "admin") {
      const totalJobs = await Job.countDocuments();
      const totalStudents = await User.countDocuments({ role: "student" });
      const totalApplications = await Application.countDocuments();

      return res.status(200).json([
        { label: "Open Jobs", value: totalJobs },
        { label: "Students", value: totalStudents },
        { label: "Applications", value: totalApplications },
      ]);
    }

    if (role === "recruiter") {
      const myJobs = await Job.find({ postedBy: req.user.id });
      const myJobIds = myJobs.map((j) => j._id);
      const totalApplicants = await Application.countDocuments({ job: { $in: myJobIds } });

      return res.status(200).json([
        { label: "Open Jobs", value: myJobs.length },
        { label: "Applications", value: totalApplicants },
        {
          label: "Offers Sent",
          value: await Application.countDocuments({ job: { $in: myJobIds }, status: "selected" }),
        },
      ]);
    }

    if (role === "student") {
      const totalJobs = await Job.countDocuments();
      const myApplications = await Application.countDocuments({ student: req.user.id });
      const myOffers = await Application.countDocuments({ student: req.user.id, status: "selected" });

      return res.status(200).json([
        { label: "Open Jobs", value: totalJobs },
        { label: "Applications", value: myApplications },
        { label: "Offers", value: myOffers },
      ]);
    }

    res.status(200).json([]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/applicants", authMiddleware, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You did not post this job" });
    }

    const applicants = await Application.find({ job: req.params.id }).populate(
      "student",
      "name email"
    );

    res.status(200).json({ job, applicants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/applications/:appId/status", authMiddleware, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["applied", "shortlisted", "interview", "selected", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(req.params.appId).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: `Application marked as ${status}`, application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;