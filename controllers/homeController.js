const Lily = require("../models/home");
const HouseListing = require("../models/house");


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
    const data = await Lily.find()
      .select("id projectName projectType location")
      .sort({ id: 1 });

    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getProjectsCount = async (req, res) => {
  try {
    const total = await Lily.countDocuments();

    res.json({
      success: true,
      totalProjects: total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
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
    await Lily.useFindAndModify({ id: req.params.id });
    await ProjectDetails.deleteMany({ projectId: req.params.id });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET WING/PLOT DETAILS FOR A PROJECT
exports.getProjectDetails = async (req, res) => {
  try {
    const projects = await Lily.find({})
      .select("id projectName projectType location")
      .sort({ id: 1 });

    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET ONLY HOUSE LIST FROM MAIN MODEL (Lily)
exports.getProjectHouseList = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Lily.findOne({ id });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Fetch statuses from HouseListing
    const listings = await HouseListing.find({ projectId: project.id });

    // Convert to lookup map
    const statusMap = {};
    listings.forEach((h) => {
      statusMap[h.houseNumber] = h.status;
    });

    // Merge Lily + status
    const houses = project.houseNumbers.map((no) => ({
      projectId: project.id,
      projectName: project.projectName,
      projectType: project.projectType,
      houseNumber: no,
      squareFeet: project.squareFeet,
      price: project.perHouseCost,
      status: statusMap[no] || "available", // 👈 DEFAULT
    }));

    res.json({ success: true, data: houses });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateHouseStatus = async (req, res) => {
  const { projectId, houseNumber } = req.params;
  const { status } = req.body;
  try {
    // ensure numeric projectId when querying the HouseListing (schema expects Number)
    const pid = Number(projectId);

    // find project to populate the ObjectId reference required by the schema
    const projectDoc = await Lily.findOne({ id: pid });
    if (!projectDoc) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const update = {
      status,
      project: projectDoc._id,
      projectId: projectDoc.id,
      houseNumber,
    };

    const record = await HouseListing.findOneAndUpdate(
      { projectId: pid, houseNumber },
      update,
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHouseStatusCounts = async (req, res) => {
  try {
    const result = await HouseListing.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Default counts
    const counts = {
      available: 0,
      booked: 0,
      sold: 0,
    };

    result.forEach((item) => {
      counts[item._id] = item.count;
    });

    res.json({
      success: true,
      data: counts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

