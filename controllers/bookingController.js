const Booking = require("../models/booking");
const HouseListing = require("../models/house");

/* ================= CREATE BOOKING ================= */
exports.createBooking = async (req, res) => {
  try {
    const {
      projectId,
      houseNumber,
      customerName,
      mobileNo,
      paymentType,

      totalSqFeet,
      pricePerSqFeet,

      advancePayment = 0,
      emiMonths,
      monthlyEmi,
    } = req.body;

    /* ===== Validation ===== */
    if (!projectId || !houseNumber) {
      return res.status(400).json({
        success: false,
        message: "Project and house number are required",
      });
    }

    if (!totalSqFeet || !pricePerSqFeet) {
      return res.status(400).json({
        success: false,
        message: "Total sq.ft and price per sq.ft are required",
      });
    }

    /* ===== STEP 1: TOTAL AMOUNT ===== */
    const totalAmount =
      Number(totalSqFeet) * Number(pricePerSqFeet);

    /* ===== STEP 2: ADVANCE AMOUNT ===== */
    const advance = Number(advancePayment) || 0;

    if (advance > totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Advance amount cannot be greater than total amount",
      });
    }

    /* ===== STEP 3: PENDING AMOUNT ===== */
    const pendingAmount = totalAmount - advance;

    /* ===== Check House Status ===== */
    let house = await HouseListing.findOne({ projectId, houseNumber });

    if (house && house.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "House already booked",
      });
    }

    if (!house) {
      house = new HouseListing({ projectId, houseNumber });
    }

    house.status = "booked";
    await house.save();

    /* ===== EMI Schedule (optional) ===== */
    let emiSchedule = [];

    if (paymentType === "emi") {
      if (!emiMonths || !monthlyEmi) {
        return res.status(400).json({
          success: false,
          message: "EMI months and amount are required",
        });
      }

      let remaining = pendingAmount;

      for (let i = 1; i <= emiMonths; i++) {
        const amount = i === emiMonths ? remaining : monthlyEmi;

        emiSchedule.push({
          monthNo: i,
          amount,
          status: "pending",
        });

        remaining -= monthlyEmi;
      }
    }

    /* ===== Save Booking ===== */
    const booking = await Booking.create({
      projectId,
      houseNumber,
      customerName,
      mobileNo,

      totalSqFeet,
      pricePerSqFeet,

      totalAmount,        // ✅ FIRST
      advancePayment: advance, // ✅ SECOND
      pendingAmount,      // ✅ THIRD

      paymentType,
      emiMonths: paymentType === "emi" ? emiMonths : 0,
      monthlyEmi: paymentType === "emi" ? monthlyEmi : 0,
      emiSchedule,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};





/* ================= GET ALL BOOKINGS ================= */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= GET SINGLE BOOKING ================= */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= PAY EMI ================= */
exports.payEmi = async (req, res) => {
  try {
    const { bookingId, monthNo } = req.body;

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const emi = booking.emiSchedule.find(e => e.monthNo === monthNo);

    if (!emi || emi.status === "paid") {
      return res.status(400).json({ success: false, message: "Invalid EMI" });
    }

    emi.status = "paid";
    emi.paidDate = new Date();
    booking.pendingAmount -= emi.amount;

    /* If fully paid */
    if (booking.pendingAmount <= 0) {
      booking.pendingAmount = 0;
      await HouseListing.findOneAndUpdate(
        { projectId: booking.projectId, houseNumber: booking.houseNumber },
        { status: "sold" }
      );
    }

    await booking.save();

    res.json({
      success: true,
      message: "EMI paid successfully",
      pendingAmount: booking.pendingAmount,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.payCashRemaining = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    const booking = await Booking.findOne({ bookingId });
    if (!booking || booking.paymentType !== "cash") {
      return res.status(400).json({ success: false, message: "Invalid cash booking" });
    }

    booking.pendingAmount -= amount;

    if (booking.pendingAmount <= 0) {
      booking.pendingAmount = 0;
      await HouseListing.findOneAndUpdate(
        { projectId: booking.projectId, houseNumber: booking.houseNumber },
        { status: "sold" }
      );
    }

    await booking.save();

    res.json({
      success: true,
      message: "Cash payment received",
      pendingAmount: booking.pendingAmount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


