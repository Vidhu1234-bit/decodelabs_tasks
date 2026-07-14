/**
 * server.js
 *
 * Application entry point.
 * Sets up Express, middleware, routes, and centralized error handling.
 */

require("dotenv").config();

const express = require("express");
const studentRoutes = require("./routes/studentRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Core Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger (production-style, no external dependency needed)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- Health Check ----------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management API is running.",
    data: {
      health: "OK",
      docs: "/api/students",
    },
  });
});

// ---------- API Routes ----------
app.use("/api/students", studentRoutes);

// ---------- 404 + Global Error Handling ----------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Student Management API running at http://localhost:${PORT}`);
});

module.exports = app;
