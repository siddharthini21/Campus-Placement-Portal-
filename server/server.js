const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL.replace(/\/$/, ""), "http://localhost:5173", "http://127.0.0.1:5173"]
  : "*";

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.warn("MONGO_URI is not defined. The server will start without MongoDB.");
}

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.warn("MongoDB Connection Error:", error.message);
    console.warn("Server started without MongoDB. Create/register/login and job routes that need DB data will fail until the database is reachable.");
  });

app.get("/", (req, res) => {
  res.send("Placement Portal Backend is Running!");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});