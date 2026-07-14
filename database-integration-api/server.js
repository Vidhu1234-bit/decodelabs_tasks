// server.js
// This is the main entry point of the application.
// It sets up Express, connects to the database, and starts the server.

const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

// Create the express app
const app = express();

// Middleware
app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse incoming JSON request bodies

// Simple route to check if API is running
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management API is running",
  });
});

// Student routes
app.use("/api/students", studentRoutes);

// Handle unknown routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Centralized error handling middleware (should be last)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
