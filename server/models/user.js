const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    registerNumber: { type: String, default: "" },
    department: { type: String, default: "" },
    batch: { type: String, default: "" },
    cgpa: { type: Number, default: null },
    phone: { type: String, default: "" },
    skills: { type: [String], default: [] },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },

    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);