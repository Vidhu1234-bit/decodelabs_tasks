/**
 * controllers/studentController.js
 *
 * Contains all business logic for the Student resource.
 * Reads/writes go through config/db.js (JSON file storage).
 * All handlers are async and forward errors to the global error
 * handler via next(error).
 */

const { readDB, writeDB } = require("../config/db");
const { sendSuccess } = require("../utils/response");
const { ApiError } = require("../middleware/errorHandler");

/**
 * Helper: parses and validates a route param as a positive integer id.
 * Throws an ApiError(400) if invalid.
 */
function parseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "Invalid student id. It must be a positive integer.");
  }
  return id;
}

/**
 * GET /api/students
 * Returns all students. Supports optional ?course= and ?search= query
 * filters as a small production-style touch.
 */
async function getAllStudents(req, res, next) {
  try {
    const { students } = await readDB();
    let result = students;

    const { course, search } = req.query;

    if (course) {
      result = result.filter(
        (s) => s.course.toLowerCase() === String(course).toLowerCase()
      );
    }

    if (search) {
      const term = String(search).toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term)
      );
    }

    return sendSuccess(res, 200, "Students retrieved successfully.", {
      count: result.length,
      students: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/students/:id
 * Returns a single student by id.
 */
async function getStudentById(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const { students } = await readDB();

    const student = students.find((s) => s.id === id);
    if (!student) {
      throw new ApiError(404, `Student with id ${id} not found.`);
    }

    return sendSuccess(res, 200, "Student retrieved successfully.", student);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/students
 * Creates a new student. Body is already validated + normalized by
 * the validateStudent middleware.
 */
async function createStudent(req, res, next) {
  try {
    const { name, email, course, age } = req.body;
    const db = await readDB();

    const emailExists = db.students.some(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
      throw new ApiError(400, `A student with email "${email}" already exists.`);
    }

    const newStudent = {
      id: db.nextId,
      name,
      email,
      course,
      age,
    };

    db.students.push(newStudent);
    db.nextId += 1;

    await writeDB(db);

    return sendSuccess(res, 201, "Student created successfully.", newStudent);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/students/:id
 * Fully updates an existing student. Body is already validated +
 * normalized by the validateStudent middleware.
 */
async function updateStudent(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const { name, email, course, age } = req.body;

    const db = await readDB();
    const index = db.students.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new ApiError(404, `Student with id ${id} not found.`);
    }

    const emailTakenByAnother = db.students.some(
      (s) => s.id !== id && s.email.toLowerCase() === email.toLowerCase()
    );
    if (emailTakenByAnother) {
      throw new ApiError(400, `A student with email "${email}" already exists.`);
    }

    const updatedStudent = { id, name, email, course, age };
    db.students[index] = updatedStudent;

    await writeDB(db);

    return sendSuccess(res, 200, "Student updated successfully.", updatedStudent);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/students/:id
 * Deletes a student by id.
 */
async function deleteStudent(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const db = await readDB();

    const index = db.students.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new ApiError(404, `Student with id ${id} not found.`);
    }

    const [deletedStudent] = db.students.splice(index, 1);
    await writeDB(db);

    return sendSuccess(res, 200, "Student deleted successfully.", deletedStudent);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
