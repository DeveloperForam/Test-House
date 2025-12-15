const mongoose = require("mongoose");

const HouseListingSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lily",
      required: true,
    },

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

// One house number per project
HouseListingSchema.index(
  { projectId: 1, houseNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("HouseListing", HouseListingSchema);
