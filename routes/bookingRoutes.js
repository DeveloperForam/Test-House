const express = require("express");
const router = express.Router();

const {
  createBooking,
  getAllBookings,
  getBookingById,
  payEmi,
  payCashRemaining,
} = require("../controllers/bookingController");

/* ================= ROUTES ================= */

router.post("/create", createBooking);

router.get("/", getAllBookings);

router.get("/:bookingId", getBookingById);

router.post("/emi/pay/", payEmi);

router.post("/cash/pay", payCashRemaining);



module.exports = router;
