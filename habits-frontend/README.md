# 5 Daily Habit Tracker — Frontend

## Student Details

```
Student Name: <student-name>
Roll Number: <rollno>
```

## Description

This is the **React frontend** for the 5 Daily Habit Tracker application. Built with **React + Vite**, it provides a vibrant, modern, and responsive interface for managing daily habits. The frontend communicates with the Express backend via the **Fetch API**.

## Features

- Add unlimited habits (no limit — start with 5 suggested, add as many as you want)
- View all habits with colorful cards
- Mark habits as complete or pending
- Delete habits with confirmation dialog
- Dynamic progress tracking (percentage, progress bar, stats)
- Motivational messages based on completion percentage
- Perfect Day celebration (100% completion)
- Empty state when no habits exist
- Loading state with spinner
- Error state with retry button
- Responsive design (desktop, tablet, mobile)
- Smooth animations and micro-interactions

## Technologies Used

- React
- Vite
- JavaScript (JSX)
- React Router
- React Hooks (useState, useEffect)
- Fetch API
- CSS (custom design system)

## Concepts Demonstrated

| Practical | Concepts |
|-----------|----------|
| Practical 1 | JSX, Components, Props, Reusable UI |
| Practical 2 | useState, Controlled Inputs, React Router |
| Practical 3 | API Integration, useEffect, Loading, Error Handling |
| Practical 4 | Communicates with Node.js/Express REST API |

## Project Structure

```
habits-frontend-rollno/
  src/
    components/
      NavBar.jsx
      HabitCard.jsx
      Loading.jsx
      ErrorMessage.jsx
    pages/
      Home.jsx
      Habits.jsx
      About.jsx
    App.jsx
    main.jsx
    index.css
  package.json
  README.md
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| / | Home | Landing page with hero section and CTA |
| /habits | Habits | Main habit tracking dashboard |
| /about | About | Project information and technologies |

## Setup and Run

Start the backend server first, then start the frontend.

```bash
cd habits-frontend-rollno
npm install
npm run dev
```

The frontend dev server starts at http://localhost:5173

## Important

- The frontend fetches data from the Express backend at http://localhost:5000
- Start the backend server FIRST, then start the frontend
- Habit icons and colors are determined by frontend logic based on the habit title (NOT stored in the backend)
- The backend uses in-memory storage, so data resets when the server restarts
