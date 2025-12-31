const mongoose = require("mongoose");

const HouseListingSchema = new mongoose.Schema(
  {
    projectId: { type: Number, required: true },
    houseNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "sold"],
      default: "available",
    },
  },
  { timestamps: true }
);

HouseListingSchema.index(
  { projectId: 1, houseNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("HouseListing", HouseListingSchema);
