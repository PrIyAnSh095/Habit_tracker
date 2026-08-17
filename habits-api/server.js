const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

let habits = [
  { id: 1, title: "Drink 2L Water", completed: false },
  { id: 2, title: "Exercise for 30 Minutes", completed: false },
  { id: 3, title: "Read for 20 Minutes", completed: false },
  { id: 4, title: "Practice Coding", completed: false },
  { id: 5, title: "Sleep 8 Hours", completed: false },
];

let nextId = 6;

app.get("/habits", (req, res) => {
  res.status(200).json(habits);
});

app.post("/habits", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ message: "Title is required and cannot be empty." });
  }

  const newHabit = {
    id: nextId++,
    title: title.trim(),
    completed: false,
  };

  habits.push(newHabit);
  res.status(201).json(newHabit);
});

app.put("/habits/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid habit ID." });
  }

  const habit = habits.find((h) => h.id === id);
  if (!habit) {
    return res.status(404).json({ message: `Habit with ID ${id} not found.` });
  }

  const { completed } = req.body;
  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "Completed field must be a boolean value." });
  }

  habit.completed = completed;
  res.status(200).json(habit);
});

app.delete("/habits/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid habit ID." });
  }

  const index = habits.findIndex((h) => h.id === id);
  if (index === -1) {
    return res.status(404).json({ message: `Habit with ID ${id} not found.` });
  }

  const deleted = habits.splice(index, 1);
  res.status(200).json({ message: "Habit deleted successfully.", habit: deleted[0] });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`🚀 5 Daily Habit Tracker API is running on http://localhost:${PORT}`);
});
