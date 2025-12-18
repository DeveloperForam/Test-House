const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },

    title: String,
    shortDescription: String,
    description: String,
    image: String,
    features: [String],
    amenities: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
