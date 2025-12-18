const express = require("express");
const upload = require("../middleware/upload");
const controller = require("../controllers/serviceController");

const router = express.Router();

router.post("/", upload.single("image"), controller.createService);
router.put("/:id", upload.single("image"), controller.updateService);
router.get("/", controller.getAllServices);
router.delete("/:id", controller.deleteService);
router.get("/:id", controller.getServiceById);


module.exports = router;
