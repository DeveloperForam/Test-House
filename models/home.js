const mongoose = require("mongoose");
const Counter = require("./counter");

const LilySchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },

    projectName: { type: String, required: true },
    projectType: {
      type: String,
      enum: ["flat", "banglow", "row-house"],
      required: true,
    },

    location: String,

    totalWings: Number,
    totalFloors: Number,
    perFloorHouse: Number,
    totalPlots: Number,

    totalHouse: Number,
    houseNumbers: [String],
  },
  { timestamps: true }
);

/* ================= PRE SAVE ================= */
LilySchema.pre("save", async function () {
  // Auto increment ID
  if (!this.id) {
    const counter = await Counter.findOneAndUpdate(
      { model: "lily" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.count;
  }

  // Flat logic
  if (this.projectType === "flat") {
    this.totalHouse =
      (this.totalWings || 0) *
      (this.totalFloors || 0) *
      (this.perFloorHouse || 0);

    const houses = [];

    for (let w = 0; w < this.totalWings; w++) {
      const wing = String.fromCharCode(65 + w); // A, B, C
      for (let f = 1; f <= this.totalFloors; f++) {
        for (let h = 1; h <= this.perFloorHouse; h++) {
          houses.push(`${wing}-${f}${String(h).padStart(2, "0")}`);
        }
      }
    }

    this.houseNumbers = houses;
  }
  // Banglow / Row-house logic
  else {
    this.totalHouse = this.totalPlots || 0;
    this.houseNumbers = Array.from(
      { length: this.totalPlots || 0 },
      (_, i) => String(i + 1).padStart(2, "0")
    );
  }
});

module.exports = mongoose.model("Lily", LilySchema);
