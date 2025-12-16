const Lily = require("../models/home");

// GET all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Lily.find({})
      .select("id projectName projectType location")
      .sort({ id: 1 });

    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET houses of project
exports.getHouseListing = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Lily.findOne({ id });
    if (!project) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const houses = project.houseNumbers.map((no) => ({
      projectId: project.id,
      projectName: project.projectName,
      projectType: project.projectType,
      houseNumber: no,
      squareFeet: project.squareFeet,
      price: project.perHouseCost,
    }));

    res.json({ success: true, data: houses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
