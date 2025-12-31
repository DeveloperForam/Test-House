const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectDetails,
  getProjectHouseList,
  updateHouseStatus,
  getProjectsCount,
  getHouseStatusCounts,
} = require("../controllers/homeController");

// CREATE PROJECT
router.post("/", createProject);

// GET ALL PROJECTS
router.get("/", getProjects);
router.get("/count", getProjectsCount);
router.get("/status-count", getHouseStatusCounts);

// GET SINGLE PROJECT
router.get("/:id", getProject);

// UPDATE PROJECT
router.put("/:id", updateProject);

// DELETE PROJECT
router.delete("/:id", deleteProject);

// GET PROJECT DETAILS (WINGS / PLOTS)
router.get("/details/:id", getProjectDetails);

// GET HOUSE LIST DIRECTLY
router.get("/houses/:projectId", getProjectHouseList);

// UPDATE HOUSE STATUS (BOOK / SELL / CANCEL)
router.patch("/:projectId/:houseNumber", updateHouseStatus);

module.exports = router;
