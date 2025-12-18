const Service = require("../models/Service");
const Counter = require("../models/counter");


// ➕ CREATE SERVICE
exports.createService = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { model: "service" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    const service = new Service({
      id: counter.count,

      title: req.body.title,
      shortDescription: req.body.shortDescription,
      description: req.body.description,

      features: req.body.features
        ? req.body.features.split(",").map(f => f.trim())
        : [],

      amenities: req.body.amenities
        ? req.body.amenities.split(",").map(a => a.trim())
        : [],

      image: req.file ? req.file.filename : null,
    });

    await service.save();

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};



// 📥 GET ALL SERVICES
exports.getAllServices = async (req, res) => {
  const services = await Service.find().sort({ id: 1 });
  res.json({ success: true, data: services });
};


// 📄 GET SINGLE SERVICE BY ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({
      id: Number(req.params.id),
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏ UPDATE SERVICE
exports.updateService = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      description: req.body.description,

      features: req.body.features
        ? req.body.features.split(",").map(f => f.trim())
        : [],

      amenities: req.body.amenities
        ? req.body.amenities.split(",").map(a => a.trim())
        : [],
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const service = await Service.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};




// 🗑 DELETE SERVICE
exports.deleteService = async (req, res) => {
  await Service.findOneAndDelete({ id: req.params.id });
  res.json({ success: true });
};

