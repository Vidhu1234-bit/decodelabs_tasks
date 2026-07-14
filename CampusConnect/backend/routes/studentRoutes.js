// routes/studentRoutes.js
// Defines all REST API endpoints for the Student resource

const express = require('express');
const router = express.Router();

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

const validateStudent = require('../middleware/validateStudent');

router.route('/')
  .get(getAllStudents)
  .post(validateStudent, createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(validateStudent, updateStudent)
  .delete(deleteStudent);

module.exports = router;
