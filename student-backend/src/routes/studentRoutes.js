
import { Router } from "express";
import mongoose from "mongoose";
import Student from "../models/Student.js";

const router = Router();

// GET: Fetch all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add a student
router.post("/", async (req, res) => {
  try {
    const { name, education, contactNo, age } = req.body;

    if (!name?.trim() || !education?.trim() ||
        !contactNo?.trim() || age === undefined || age === "") {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    const student = await Student.create({
      name, education, contactNo, age
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Update student
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Remove student
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({ message: "Student deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
