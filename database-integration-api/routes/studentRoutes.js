// routes/studentRoutes.js
// This file defines all the API routes for students
// and connects each route to its controller function.

const express = require("express");
const router = express.Router();

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// POST /api/students -> create a new student
router.post("/", createStudent);

// GET /api/students -> get all students
router.get("/", getAllStudents);

// GET /api/students/:id -> get a single student by id
router.get("/:id", getStudentById);

// PUT /api/students/:id -> update a student by id
router.put("/:id", updateStudent);

// DELETE /api/students/:id -> delete a student by id
router.delete("/:id", deleteStudent);

module.exports = router;
