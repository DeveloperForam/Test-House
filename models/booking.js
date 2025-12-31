const mongoose = require("mongoose");
const Counter = require("./counter");

const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: Number, unique: true },

    projectId: { type: Number, required: true },
    houseNumber: { type: String, required: true },

    customerName: { type: String, required: true },
    mobileNo: { type: String, required: true },

    paymentType: {
      type: String,
      enum: ["cash", "bank"],
      required: true,
    },

    totalPayment: { type: Number, required: true },
    advancePayment: { type: Number, required: true },

    pendingAmount: { type: Number, required: true },

    bookingDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/* Auto Increment */
BookingSchema.pre("save", async function () {
  if (!this.bookingId) {
    const counter = await Counter.findOneAndUpdate(
      { model: "booking" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    this.bookingId = counter.count;
  }
});

BookingSchema.index({ projectId: 1, houseNumber: 1 }, { unique: true });

module.exports = mongoose.model("Booking", BookingSchema);
