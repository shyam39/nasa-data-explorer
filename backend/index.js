const express = require("express");
const cors = require("cors");
require("dotenv").config();

const nasaRoutes = require("./routes/nasaRoutes");  // includes /image-proxy
const marsRoutes = require("./routes/marsRoutes");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("🚀 NASA API is live!");
});

// All NASA-related routes including APOD and image-proxy
app.use("/api/nasa", nasaRoutes);

// Mars-specific routes (assumes separate endpoints)
app.use("/api/nasa/mars", marsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
