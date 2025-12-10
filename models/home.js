const mongoose = require("mongoose");
const Counter = require("./counter");

const LilySchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },

    projectName: { type: String, required: true, trim: true },

    projectType: {
      type: String,
      required: true,
      enum: ["flat", "banglow", "row-house"],
    },

    location: { type: String, required: true },

    perHouseCost: { type: Number, required: true },

    totalHouseCost: { type: Number }, // Auto calculated

    squareFeet: { type: Number, required: true },

    // For Flats
    totalWings: { type: Number },
    totalFloors: { type: Number },
    perFloorHouse: { type: Number },
    totalHouse: { type: Number },

    houseNumbers: { type: [String] },   // <-- NEW FIELD

    // For banglow / row-house
    totalPlots: { type: Number },
  },
  { timestamps: true }
);

// Auto Increment + Calculations
LilySchema.pre("save", async function () {
  // Auto increment id
  if (!this.id) {
    const counter = await Counter.findOneAndUpdate(
      { model: "lily" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.count;
  }

  // Calculate total houses based on project type
  if (this.projectType === "flat") {
    this.totalHouse = this.totalWings * this.totalFloors * this.perFloorHouse;

    // ------------------------
    // GENERATE HOUSE NUMBERS
    // ------------------------
    const houses = [];
    for (let w = 0; w < this.totalWings; w++) {
      const wingLetter = String.fromCharCode(65 + w); // A B C ...

      for (let f = 1; f <= this.totalFloors; f++) {
        for (let h = 1; h <= this.perFloorHouse; h++) {
          const houseNo = `${wingLetter}-${f}${String(h).padStart(2, "0")}`;
          houses.push(houseNo);
        }
      }
    }
    this.houseNumbers = houses;
  }

  else if (this.projectType === "banglow" || this.projectType === "row-house") {
    this.totalHouse = this.totalPlots;

    // Bungalows / Row-houses house numbering
    const houses = [];
    for (let i = 1; i <= this.totalPlots; i++) {
      houses.push(`${String(i).padStart(2, "0")}`); // P-001, P-002
    }
    this.houseNumbers = houses;
  }

  // Auto calculate total cost
  this.totalHouseCost = this.perHouseCost * this.totalHouse * this.squareFeet;
});

module.exports = mongoose.model("Lily", LilySchema);
