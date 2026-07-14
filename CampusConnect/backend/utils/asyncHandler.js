// utils/asyncHandler.js
// Wraps async controller functions to automatically catch errors
// and forward them to the Express error-handling middleware

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
