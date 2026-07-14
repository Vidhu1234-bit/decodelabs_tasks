/**
 * middleware/validateStudent.js
 *
 * Validates the request body for creating/updating a student.
 *
 * Rules:
 * - name    : required, non-empty string
 * - email   : required, must be a valid email format
 * - course  : required, non-empty string
 * - age     : required, number between 16 and 60 (inclusive)
 *
 * For PUT (update), fields are still validated if present, but a field
 * missing entirely is allowed only when `partial` is true (PATCH-style).
 * For this project PUT is treated as a full update, so all fields are
 * required on both create and update to keep behavior predictable.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStudent(req, res, next) {
  const { name, email, course, age } = req.body || {};
  const errors = [];

  // ---- name ----
  if (name === undefined || name === null || String(name).trim() === "") {
    errors.push("Name is required.");
  } else if (typeof name !== "string") {
    errors.push("Name must be a string.");
  }

  // ---- email ----
  if (email === undefined || email === null || String(email).trim() === "") {
    errors.push("Email is required.");
  } else if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("Email format is invalid.");
  }

  // ---- course ----
  if (course === undefined || course === null || String(course).trim() === "") {
    errors.push("Course is required.");
  } else if (typeof course !== "string") {
    errors.push("Course must be a string.");
  }

  // ---- age ----
  if (age === undefined || age === null || age === "") {
    errors.push("Age is required.");
  } else {
    const numericAge = Number(age);
    if (Number.isNaN(numericAge) || !Number.isInteger(numericAge)) {
      errors.push("Age must be a valid integer.");
    } else if (numericAge < 16 || numericAge > 60) {
      errors.push("Age must be between 16 and 60.");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  // Normalize types before passing to the controller.
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.course = course.trim();
  req.body.age = Number(age);

  next();
}

module.exports = validateStudent;
