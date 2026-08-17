# 5 Daily Habit Tracker — Backend API

## Student Details

```
Student Name: <student-name>
Roll Number: <rollno>
```

## Description

This is the backend REST API for the **5 Daily Habit Tracker** application. Built with **Node.js** and **Express.js**, it provides CRUD endpoints to manage daily habits. The data is stored in an **in-memory JavaScript array**, which means all data resets when the server restarts.

## Features

- RESTful API with full CRUD operations
- In-memory data storage (no database required)
- 5 pre-loaded starter habits
- Request logging middleware
- Input validation with proper error messages
- Proper HTTP status codes (200, 201, 400, 404, 500)
- 404 handler for undefined routes
- Global error handler
- CORS enabled for frontend communication

## API Endpoints

### GET /habits — Get All Habits

**Response:** `200 OK`

```json
[
  { "id": 1, "title": "Drink 2L Water", "completed": false },
  { "id": 2, "title": "Exercise for 30 Minutes", "completed": true }
]
```

### POST /habits — Add New Habit

**Request Body:**

```json
{ "title": "Learn Git" }
```

**Response:** `201 Created`

```json
{ "id": 6, "title": "Learn Git", "completed": false }
```

**Error (empty title):** `400 Bad Request`

```json
{ "message": "Title is required and cannot be empty" }
```

### PUT /habits/:id — Update a Habit

**Request Body:**

```json
{ "title": "Drink 3L Water", "completed": true }
```

**Response:** `200 OK`

```json
{ "id": 1, "title": "Drink 3L Water", "completed": true }
```

**Error (not found):** `404 Not Found`

```json
{ "message": "Habit not found" }
```

### DELETE /habits/:id — Delete a Habit

**Response:** `200 OK`

```json
{ "message": "Habit deleted successfully", "habit": { "id": 1, "title": "Drink 2L Water", "completed": false } }
```

**Error (not found):** `404 Not Found`

```json
{ "message": "Habit not found" }
```

### Undefined Route

**Response:** `404 Not Found`

```json
{ "message": "Route not found" }
```

## Setup & Run

```bash
cd habits-api-<rollno>
npm install
node server.js
```

Server runs at: `http://localhost:5000`

## Technologies Used

- Node.js
- Express.js
- JavaScript
- REST API
- CORS

## Concepts Demonstrated

- Express middleware (`express.json()`, logging, error handling)
- `next()` function in middleware
- Route handlers (GET, POST, PUT, DELETE)
- HTTP status codes (200, 201, 400, 404, 500)
- Request/response cycle
- In-memory data storage
- Input validation

## Important

This API uses an **in-memory JavaScript array** for data storage. All data resets when the server restarts. This is intentional and required by the practical specifications.
