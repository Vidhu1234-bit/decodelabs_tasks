/**
 * utils/response.js
 *
 * Standardized JSON response helpers so every endpoint returns
 * a consistent shape:
 *
 * Success -> { success: true, message, data }
 * Error   -> { success: false, message, errors? }
 */

function sendSuccess(res, statusCode = 200, message = "Success", data = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function sendError(res, statusCode = 500, message = "Something went wrong", errors = null) {
  const payload = {
    success: false,
    message,
  };

  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  sendSuccess,
  sendError,
};
