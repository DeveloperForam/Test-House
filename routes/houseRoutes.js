const express = require("express");
const router = express.Router();

// ✅ IMPORT controller functions
const {
  getAllProjects,
  getHouseListing,
  updateHouseStatus,
} = require("../controllers/houseController");

// Routes
router.get("/", getAllProjects);
router.get("/project/:id", getHouseListing);
router.patch("/:projectId/:houseNumber", updateHouseStatus);

module.exports = router;
