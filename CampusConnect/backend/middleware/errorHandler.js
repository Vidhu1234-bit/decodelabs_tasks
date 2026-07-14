// middleware/errorHandler.js
// Centralized error-handling middleware. Must be registered LAST in server.js

const config = require('../config/config');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((val) => val.message);
    message = 'Validation failed';
  }

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `A student with this ${field} already exists`;
  }

  // Mongoose invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  console.error(`❌ [${req.method}] ${req.originalUrl} -> ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
