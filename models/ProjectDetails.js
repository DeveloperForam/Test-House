const mongoose = require("mongoose");
const Home = require("./home"); // your LilySchema

const ProjectDetailsSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true },
    projectName: String,
    projectType: String,
    location: String,
    wingsOrPlots: Number,
    houseNumbers: [String],
    perHouseCost: Number,
    totalHouseCost: Number,
}, { timestamps: true });

module.exports = mongoose.model("ProjectDetails", ProjectDetailsSchema);
