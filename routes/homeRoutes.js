const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectDetails,
  getProjectHouseList ,
  updateHouseStatus,
  getProjectsCount,  
  getHouseStatusCounts,
} = require("../controllers/homeController");

// CREATE
router.post("/", createProject);

// GET ALL
router.get("/", getProjects);
router.get("/count", getProjectsCount);
router.get("/status-count", getHouseStatusCounts);


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

//status update
router.patch("/:projectId/:houseNumber", updateHouseStatus);





module.exports = router;
