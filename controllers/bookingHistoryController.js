const Booking = require("../models/booking");
const BookingHistory = require("../models/bookingHistory");

/* ================= ADD PAYMENT ================= */
exports.addPayment = async (req, res) => {
  try {
    const {
  bookingId,
  amountReceived,
  paymentMethod,
  paymentDetails,   // ✅ NEW
  paymentReceivedDate,
} = req.body;

    if (!bookingId || !amountReceived || !paymentMethod || !paymentReceivedDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (amountReceived > booking.pendingAmount) {
      return res.status(400).json({
        message: "Amount exceeds pending payment",
      });
    }

    const history = new BookingHistory({
  bookingId: booking._id,
  customerName: booking.customerName,
  houseNumber: booking.houseNumber,
  totalAmount: booking.totalPayment,
  advancePayment: booking.advancePayment,
  pendingAmount: booking.pendingAmount - amountReceived,
  amountReceived,
  paymentMethod,
  paymentDetails, // ✅ NEW
  paymentReceivedDate,
});


    booking.pendingAmount -= amountReceived;
    await booking.save();

    await history.save();

    res.status(201).json({
      message: "Payment recorded successfully",
      data: history,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* ================= GET DATE-WISE HISTORY ================= */
exports.getPaymentHistory = async (req, res) => {
  try {
    const { bookingId, fromDate, toDate, paymentMethod } = req.query;

    const filter = {};

    if (bookingId) {
      filter.bookingId = bookingId;
    }

    if (fromDate && toDate) {
      filter.paymentReceivedDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    const history = await BookingHistory.find(filter)
      .sort({ paymentReceivedDate: 1 });

    res.json({ data: history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
