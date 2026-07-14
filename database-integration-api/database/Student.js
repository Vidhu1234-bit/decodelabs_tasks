// database/Student.js
// This file defines the Mongoose schema and model for a Student.

const mongoose = require("mongoose");

// Define the structure of a Student document
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // no two students can have the same email
    trim: true,
    lowercase: true,
    // simple regex to check basic email format
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  course: {
    type: String,
    required: [true, "Course is required"],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [1, "Age must be a positive number"],
  },
  createdAt: {
    type: Date,
    default: Date.now, // automatically set when a student is created
  },
});

// Create the model from the schema
// Mongoose will create a collection called "students" in MongoDB
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
