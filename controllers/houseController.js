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
exports.updateHouseStatus = async (req, res) => {
  const { projectId, houseNumber } = req.params;
  const { status } = req.body;

  try {
    const pid = Number(projectId);

    const projectDoc = await Lily.findOne({ id: pid });
    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const record = await HouseListing.findOneAndUpdate(
      { projectId: pid, houseNumber },
      {
        status,
        project: projectDoc._id,
        projectId: projectDoc.id,
        houseNumber,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
