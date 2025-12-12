const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const lilyRoutes  = require("./routes/homeRoutes");
const projectDetailsRoutes = require("./routes/projectDetailsRoutes");


const app = express();
app.use(cors());
app.use(express.json());

// Connect DB first
connectDB().then(() => {
  console.log("MongoDB connected");

  // Register routes after DB is connected
  app.use("/api/lily", lilyRoutes );
app.use("/api", projectDetailsRoutes);



  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
