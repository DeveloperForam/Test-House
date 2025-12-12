const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectDetails,
  getProjectHouseList   
} = require("../controllers/homeController");

// CREATE
router.post("/", createProject);

// GET ALL
router.get("/", getProjects);

// GET SINGLE PROJECT
router.get("/:id", getProject);

// UPDATE
router.put("/:id", updateProject);

// DELETE
router.delete("/:id", deleteProject);

// GET WING-WISE OR PLOT-WISE HOUSE LIST
router.get("/details/:id", getProjectDetails);

// GET HOUSE LIST DIRECTLY (WITHOUT PROJECTDETAILS)
router.get("/houses/:id", getProjectHouseList);


module.exports = router;
