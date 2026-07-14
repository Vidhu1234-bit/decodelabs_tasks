/**
 * routes/studentRoutes.js
 *
 * Defines all /api/students routes and wires them to the
 * studentController handlers, applying validation middleware
 * where needed.
 */

const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const validateStudent = require("../middleware/validateStudent");

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", validateStudent, createStudent);
router.put("/:id", validateStudent, updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
