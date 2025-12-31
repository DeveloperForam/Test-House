const mongoose = require("mongoose");
const Lily = require("../models/home");
const HouseListing = require("../models/house");

mongoose.connect("mongodb://127.0.0.1:27017/Bob");

(async () => {
  const project = await Lily.findOne({ id: 2 });

  if (!project) {
    console.log("Row-house project not found");
    process.exit();
  }

  const houses = project.houseNumbers.map((houseNo) => ({
    project: project._id,
    projectId: project.id,
    houseNumber: houseNo,
    status: "available",
  }));

  await HouseListing.insertMany(houses, { ordered: false });

  console.log("Row-house HouseListings created:", houses.length);
  process.exit();
})();
