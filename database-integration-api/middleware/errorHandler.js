// middleware/errorHandler.js
// This is a centralized error handling middleware.
// If any route calls next(error), this middleware will catch it
// and send back a clean JSON response instead of crashing the server.

const errorHandler = (err, req, res, next) => {
  console.log("Error Handler Caught:", err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong on the server";

  // Handle Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists. Please use another value.`;
  }

  // Handle Mongoose validation errors (missing/invalid fields)
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((val) => val.message);
    message = errors.join(", ");
  }

  // Handle invalid MongoDB ObjectId (bad format in :id param)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;
