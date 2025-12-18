const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const lilyRoutes = require("./routes/homeRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static("uploads"));

/* ================= CONNECT DB & ROUTES ================= */
connectDB()
  .then(() => {
    console.log("MongoDB connected");

    app.use("/api/lily", lilyRoutes);
    app.use("/api/services", serviceRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
