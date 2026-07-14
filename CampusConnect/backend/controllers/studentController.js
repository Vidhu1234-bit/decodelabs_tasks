// controllers/studentController.js
// Contains all business logic for Student CRUD operations

const mongoose = require('mongoose');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const ApiError = require('../utils/ApiError');

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Students fetched successfully', students);
});

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Public
const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid student ID format');
  }

  const student = await Student.findById(id);

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  return sendSuccess(res, 200, 'Student fetched successfully', student);
});

// @desc    Create a new student
// @route   POST /api/students
// @access  Public
const createStudent = asyncHandler(async (req, res) => {
  const { name, email, course, age } = req.body;

  const student = await Student.create({ name, email, course, age });

  return sendSuccess(res, 201, 'Student created successfully', student);
});

// @desc    Update an existing student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, course, age } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid student ID format');
  }

  const student = await Student.findByIdAndUpdate(
    id,
    { name, email, course, age },
    { new: true, runValidators: true }
  );

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  return sendSuccess(res, 200, 'Student updated successfully', student);
});

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid student ID format');
  }

  const student = await Student.findByIdAndDelete(id);

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  return sendSuccess(res, 200, 'Student deleted successfully', student);
});

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
