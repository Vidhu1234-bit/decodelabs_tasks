// controllers/studentController.js
// This file contains all the logic for handling Student CRUD operations.

const mongoose = require("mongoose");
const Student = require("../database/Student");
const { sendSuccess, sendError } = require("../utils/response");

// -------------------------------------------------
// CREATE STUDENT
// POST /api/students
// -------------------------------------------------
const createStudent = async (req, res) => {
  try {
    const { name, email, course, age } = req.body;

    // Basic manual validation for missing fields
    if (!name || !email || !course || !age) {
      return sendError(res, 400, "Please provide name, email, course and age");
    }

    // Create a new student document
    const student = await Student.create({ name, email, course, age });

    return sendSuccess(res, 201, "Student created successfully", student);
  } catch (error) {
    // Duplicate email error from MongoDB (error code 11000)
    if (error.code === 11000) {
      return sendError(res, 400, "Email already exists");
    }

    // Mongoose validation error (invalid email format, missing fields, etc.)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return sendError(res, 400, messages.join(", "));
    }

    console.log(error.message);
    return sendError(res, 500, "Server error while creating student");
  }
};

// -------------------------------------------------
// GET ALL STUDENTS
// GET /api/students
// -------------------------------------------------
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Students fetched successfully", students);
  } catch (error) {
    console.log(error.message);
    return sendError(res, 500, "Server error while fetching students");
  }
};

// -------------------------------------------------
// GET SINGLE STUDENT
// GET /api/students/:id
// -------------------------------------------------
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid student ID");
    }

    const student = await Student.findById(id);

    if (!student) {
      return sendError(res, 404, "Student not found");
    }

    return sendSuccess(res, 200, "Student fetched successfully", student);
  } catch (error) {
    console.log(error.message);
    return sendError(res, 500, "Server error while fetching student");
  }
};

// -------------------------------------------------
// UPDATE STUDENT
// PUT /api/students/:id
// -------------------------------------------------
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, course, age } = req.body;

    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid student ID");
    }

    // Check if student exists first
    const existingStudent = await Student.findById(id);

    if (!existingStudent) {
      return sendError(res, 404, "Student not found");
    }

    // Update the student with new values
    // runValidators makes sure the schema rules still apply on update
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, email, course, age },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, "Student updated successfully", updatedStudent);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 400, "Email already exists");
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return sendError(res, 400, messages.join(", "));
    }

    console.log(error.message);
    return sendError(res, 500, "Server error while updating student");
  }
};

// -------------------------------------------------
// DELETE STUDENT
// DELETE /api/students/:id
// -------------------------------------------------
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid student ID");
    }

    const student = await Student.findById(id);

    if (!student) {
      return sendError(res, 404, "Student not found");
    }

    await Student.findByIdAndDelete(id);

    return sendSuccess(res, 200, "Student deleted successfully", student);
  } catch (error) {
    console.log(error.message);
    return sendError(res, 500, "Server error while deleting student");
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
