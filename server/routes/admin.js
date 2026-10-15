const express = require("express");
const User = require("../models/user");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Get all students
router.get("/students", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {
        const students = await User.find({ role: "student" }).select("-password");
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all recruiters
router.get("/recruiters", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {
        const recruiters = await User.find({ role: "recruiter" }).select("-password");
        res.status(200).json(recruiters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all jobs (admin view)
router.get("/jobs", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {
        const jobs = await Job.find().populate("postedBy", "name email").sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Block / unblock a user
router.patch("/users/:id/block", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({
            message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
            isBlocked: user.isBlocked,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a user
router.delete("/users/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a job
router.delete("/jobs/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        await Application.deleteMany({ job: req.params.id });
        res.status(200).json({ message: "Job deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;