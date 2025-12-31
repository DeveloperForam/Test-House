const express = require("express");
const router = express.Router();
const {
  addPayment,
  getPaymentHistory,
  getBookingById,
} = require("../controllers/bookingHistoryController");

/* Add payment */
router.post("/add-payment", addPayment);
router.get("/", getPaymentHistory);
router.get("/:id", getBookingById);

const Booking = require("../models/booking");

// GET single booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
