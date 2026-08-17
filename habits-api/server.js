const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

// Fix querySrv ECONNREFUSED on Windows for MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const Habit = require("./models/habits");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/habit_tracker";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

// Helper to format Mongoose documents with 'id' and '_id' for frontend compatibility
const formatHabit = (h) => ({
  id: h._id.toString(),
  _id: h._id.toString(),
  title: h.title,
  completed: h.completed,
  createdAt: h.createdAt,
});

// GET all habits
app.get("/habits", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.status(200).json(habits.map(formatHabit));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch habits" });
  }
});

// POST new habit
app.post("/habits", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required and cannot be empty." });
    }

    const newHabit = await Habit.create({ title: title.trim() });
    res.status(201).json(formatHabit(newHabit));
  } catch (err) {
    res.status(500).json({ message: "Failed to create habit" });
  }
});

// PUT update habit completion status
app.put("/habits/:id", async (req, res) => {
  try {
    const { completed } = req.body;
    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "Completed field must be a boolean value." });
    }

    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ message: `Habit with ID ${req.params.id} not found.` });
    }

    res.status(200).json(formatHabit(updatedHabit));
  } catch (err) {
    res.status(500).json({ message: "Failed to update habit" });
  }
});

// DELETE habit
app.delete("/habits/:id", async (req, res) => {
  try {
    const deletedHabit = await Habit.findByIdAndDelete(req.params.id);
    if (!deletedHabit) {
      return res.status(404).json({ message: `Habit with ID ${req.params.id} not found.` });
    }
    res.status(200).json({ message: "Habit deleted successfully.", habit: formatHabit(deletedHabit) });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete habit" });
  }
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`🚀 5 Daily Habit Tracker API is running on http://localhost:${PORT}`);
});
