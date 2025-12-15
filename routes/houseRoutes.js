const express = require("express");
const router = express.Router();
const controller = require("../controllers/houseController");

router.get("/", controller.getAllProjects);
router.get("/:id/houses", controller.getHouseListing);

module.exports = router;
