// utils/response.js
// This file contains helper functions to send consistent JSON responses
// from all controllers. This keeps the response format the same everywhere.

// Send a success response
// statusCode: HTTP status code (200, 201, etc.)
// message: a short message describing what happened
// data: the actual data to send back (object, array, or null)
function sendSuccess(res, statusCode, message, data) {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
}

// Send an error/failure response
// statusCode: HTTP status code (400, 404, 500, etc.)
// message: a short message describing the error
function sendError(res, statusCode, message) {
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
}

module.exports = { sendSuccess, sendError };
