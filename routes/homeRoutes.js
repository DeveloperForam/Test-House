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
  getProjectsCount,
  getHouseStatusCounts,
} = require("../controllers/homeController");

// CREATE PROJECT
router.post("/", createProject);

// COUNTS
router.get("/count", getProjectsCount);
router.get("/status-count", getHouseStatusCounts);

// DETAILS & HOUSES
router.get("/details/:id", getProjectDetails);
router.get("/houses/:projectId", getProjectHouseList);

// PROJECT CRUD
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// ❌ REMOVED updateHouseStatus route

module.exports = router;
