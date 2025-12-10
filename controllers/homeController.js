const Lily = require("../models/home");
const ProjectDetails = require("../models/ProjectDetails");

// CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    const project = new Lily(req.body);
    await project.save(); // auto generates house numbers + project details

    res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const data = await Lily.find().sort({ id: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE PROJECT
exports.getProject = async (req, res) => {
  try {
    const project = await Lily.findOne({ id: req.params.id });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE PROJECT
exports.updateProject = async (req, res) => {
  try {
    // REMOVE OLD DETAILS (auto-regenerated)
    await ProjectDetails.deleteMany({ projectId: req.params.id });

    const updated = await Lily.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );

    await updated.save(); // regenerate wings/plots list

    res.json({
      message: "Project updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE PROJECT
exports.deleteProject = async (req, res) => {
  try {
    await Lily.findOneAndDelete({ id: req.params.id });
    await ProjectDetails.deleteMany({ projectId: req.params.id });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET WING/PLOT DETAILS FOR A PROJECT
exports.getProjectDetails = async (req, res) => {
  try {
    const details = await ProjectDetails.find({
      projectId: req.params.id,
    }).sort({ wing: 1 });

    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
