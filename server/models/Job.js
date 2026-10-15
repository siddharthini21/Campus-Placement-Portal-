const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Eligibility criteria
    minCgpa: { type: Number, default: 0 },
    eligibleDepartments: { type: [String], default: [] }, // empty = all departments allowed
    deadline: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);