/**
 * middleware/errorHandler.js
 *
 * Centralized error handling for the whole application.
 *
 * - ApiError: a custom error class controllers can throw with a specific
 *   HTTP status code attached.
 * - notFoundHandler: catches requests to routes that don't exist (404).
 * - errorHandler: the final Express error-handling middleware (4 args)
 *   that formats every thrown/forwarded error into a consistent JSON body.
 */

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

// Handles any request that didn't match a defined route.
function notFoundHandler(req, res, next) {
  const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
}

// Express recognizes this as error-handling middleware because it takes 4 args.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${statusCode}: ${message}`);
    if (statusCode === 500) {
      console.error(err.stack);
    }
  }

  const response = {
    success: false,
    message,
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
}

module.exports = {
  ApiError,
  notFoundHandler,
  errorHandler,
};
