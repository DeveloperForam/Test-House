const mongoose = require("mongoose");

const BookingHistorySchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    customerName: { type: String, required: true },
    houseNumber: { type: String, required: true },

    totalAmount: { type: Number, required: true },
    advancePayment: { type: Number, required: true },
    pendingAmount: { type: Number, required: true },

    amountReceived: { type: Number, required: true },

    /* PAYMENT METHOD */
    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "bank", "cheque", "card"],
      required: true,
    },

    /* METHOD WISE DETAILS */
    paymentDetails: {
  /* UPI */
  upiTxnId: String,

  /* Bank */
  bankName: String,
  transactionId: String,

  /* Cheque */
  chequeNo: String,
  chequeDate: Date,

  /* Card */
  cardType: { type: String, enum: ["debit", "credit"] },
  last4Digits: String,
},

    paymentReceivedDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

/* Index for reports */
BookingHistorySchema.index({ paymentReceivedDate: 1 });

// BookingHistorySchema.pre("save", function () {
//   const d = this.paymentDetails || {};

//   if (this.paymentMethod === "upi" && !d.upiTxnId)
//     throw new Error("UPI Transaction ID required");

//   if (this.paymentMethod === "bank" && !d.transactionId)
//     throw new Error("Bank Transaction ID required");

//   if (this.paymentMethod === "cheque" && !d.chequeNo)
//     throw new Error("Cheque number required");

//   if (this.paymentMethod === "card" && !d.last4Digits)
//     throw new Error("Card last 4 digits required");
// });

module.exports = mongoose.model("BookingHistory", BookingHistorySchema);
