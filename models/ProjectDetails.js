// models/projectDetails.js
const mongoose = require("mongoose");

const ProjectDetailsSchema = new mongoose.Schema(
  {
    projectId: { type: Number, required: true }, // reference to home.js (LilySchema)

    // These are stored for record
    houseNumbers: { type: [String] },
    perHouseCost: { type: Number },
    totalHouseCost: { type: Number },
    location: { type: String },
    projectType: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectDetails", ProjectDetailsSchema);
