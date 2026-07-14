// middleware/validateStudent.js
// Performs basic request-body validation before hitting the controller

const { sendError } = require('../utils/apiResponse');

const validateStudent = (req, res, next) => {
  const { name, email, course, age } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email is required');
  }

  if (!course || typeof course !== 'string' || course.trim().length < 2) {
    errors.push('Course is required and must be at least 2 characters long');
  }

  if (age === undefined || age === null || isNaN(age) || age < 15 || age > 100) {
    errors.push('Age is required and must be a number between 15 and 100');
  }

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed', errors);
  }

  next();
};

module.exports = validateStudent;
