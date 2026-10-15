const express = require("express");
const User = require("../models/user");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Get current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update student profile
router.put("/profile", authMiddleware, authorizeRoles("student"), async (req, res) => {
  try {
    const {
      registerNumber,
      department,
      batch,
      cgpa,
      phone,
      skills,
      github,
      linkedin,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        registerNumber,
        department,
        batch,
        cgpa,
        phone,
        skills,
        github,
        linkedin,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload resume
router.post(
  "/upload-resume",
  authMiddleware,
  authorizeRoles("student"),
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const resumeUrl = `/uploads/resumes/${req.file.filename}`;

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { resumeUrl },
        { new: true }
      ).select("-password");

      res.status(200).json({
        message: "Resume uploaded successfully",
        resumeUrl,
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;