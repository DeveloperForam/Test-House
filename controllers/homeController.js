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
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================
// GET PROJECT COUNT
// ==============================
exports.getProjectsCount = async (req, res) => {
  try {
    const total = await Lily.countDocuments();
    res.json({ success: true, totalProjects: total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================
// GET ONE PROJECT
// ==============================
exports.getProject = async (req, res) => {
  try {
    const project = await Lily.findOne({ id: req.params.id });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// UPDATE PROJECT
// ==============================
exports.updateProject = async (req, res) => {
  try {
    const updated = await Lily.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    await updated.save();
    res.json({ message: "Project updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// DELETE PROJECT
// ==============================
exports.deleteProject = async (req, res) => {
  try {
    await Lily.deleteOne({ id: req.params.id });
    await HouseListing.deleteMany({ projectId: Number(req.params.id) });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// GET PROJECT DETAILS (WINGS / PLOTS)
// ==============================
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

// ==============================
// GET HOUSE LIST DIRECTLY
// ==============================
exports.getProjectHouseList = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);

    const project = await Lily.findOne({ id: projectId });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // ✅ booking collection decides availability
    const bookings = await Booking.find({ projectId });
    const bookedSet = new Set(bookings.map(b => String(b.houseNumber)));

    const houses = project.houseNumbers.map(no => ({
      projectId,
      houseNumber: no,
      status: bookedSet.has(String(no)) ? "booked" : "available",
    }));

    res.json({ success: true, data: houses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================
// UPDATE HOUSE STATUS (BOOK / SOLD / CANCEL)
// ==============================
exports.updateHouseStatus = async (req, res) => {
  const { projectId, houseNumber } = req.params;
  const { action, customerName, customerPhone, amount } = req.body;

  try {
    const pid = Number(projectId);
    const projectDoc = await Lily.findOne({ id: pid });
    if (!projectDoc) return res.status(404).json({ success: false, message: "Project not found" });

    let house = await HouseListing.findOne({ projectId: pid, houseNumber });
    if (!house) house = new HouseListing({ project: projectDoc._id, projectId: pid, houseNumber });

    if (action === "book") {
      if (house.status === "sold") return res.status(400).json({ success: false, message: "House already sold" });
      house.booked = { customerName, customerPhone, advanceAmount: amount };
      house.sold = null;
    } else if (action === "sell") {
      house.sold = { customerName, customerPhone, totalAmount: amount };
      house.booked = null;
    } else if (action === "cancel") {
      if (house.status !== "booked") return res.status(400).json({ success: false, message: "House is not booked" });
      house.booked = null;
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    await house.save();
    res.json({ success: true, data: house });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================
// GET HOUSE STATUS COUNTS
// ==============================
exports.getHouseStatusCounts = async (req, res) => {
  try {
    const result = await HouseListing.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const counts = { available: 0, booked: 0, sold: 0 };
    result.forEach((item) => { counts[item._id] = item.count; });
    res.json({ success: true, data: counts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
