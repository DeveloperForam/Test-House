const Lily = require("../models/home");
const HouseListing = require("../models/house");
const Booking = require("../models/booking");

// ==============================
// CREATE PROJECT
// ==============================
exports.createProject = async (req, res) => {
  try {
    const project = new Lily(req.body);
    await project.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// GET ALL PROJECTS
// ==============================
exports.getProjects = async (req, res) => {
  try {
    const projects = await Lily.find().select(`
      id
      projectName
      projectType
      location
      totalWings
      totalFloors
      perFloorHouse
      totalPlots
    `);

    res.json({
      success: true,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// GET PROJECT COUNT
// ==============================
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

// ==============================
// GET ONE PROJECT
// ==============================
exports.getProject = async (req, res) => {
  try {
    const project = await Lily.findOne({ id: Number(req.params.id) });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// UPDATE PROJECT
// ==============================
exports.updateProject = async (req, res) => {
  try {
    const updated = await Lily.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      message: "Project updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// DELETE PROJECT
// ==============================
exports.deleteProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    await Lily.deleteOne({ id: projectId });
    await HouseListing.deleteMany({ projectId });

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// GET PROJECT DETAILS (Dropdown / List)
// ==============================
exports.getProjectDetails = async (req, res) => {
  try {
    const projects = await Lily.find({})
      .select("id projectName projectType location")
      .sort({ id: 1 });

    res.json({
      success: true,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// GET HOUSE LIST (Availability via Booking)
// ==============================
exports.getProjectHouseList = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);

    const project = await Lily.findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Booking decides availability
    const bookings = await Booking.find({ projectId });
    const bookedSet = new Set(bookings.map(b => String(b.houseNumber)));

    const houses = project.houseNumbers.map(no => ({
      projectId,
      houseNumber: no,
      status: bookedSet.has(String(no)) ? "booked" : "available",
    }));

    res.json({
      success: true,
      data: houses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// GET HOUSE STATUS COUNTS
// ==============================
exports.getHouseStatusCounts = async (req, res) => {
  try {
    const result = await HouseListing.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const counts = { available: 0, booked: 0, sold: 0 };
    result.forEach(r => (counts[r._id] = r.count));

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
