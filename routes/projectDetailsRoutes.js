const express = require("express");
const router = express.Router();
const projectDetailsController = require("../controllers/projectDetailsController");

// GET project details by project id
router.get("/project-details/", projectDetailsController.getProjectDetails);
router.get("/project-details/:id", projectDetailsController.getProjectDetails);

module.exports = router;
