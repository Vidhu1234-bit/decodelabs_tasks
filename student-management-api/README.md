# Student Management REST API

A clean, modular, production-style **Student Management REST API** built with **Node.js** and **Express.js**, using a **JSON file (`db.json`)** as the data store — no MongoDB, no SQL required.

---

## 1. Project Overview

This API allows you to perform full **CRUD** (Create, Read, Update, Delete) operations on student records. It follows a layered architecture (routes → middleware → controllers → data layer) similar to what you'd find in a real production Node.js backend, keeping concerns separated and the codebase easy to extend.

**Student fields:** `id`, `name`, `email`, `course`, `age`

---

## 2. Folder Structure

```
student-management-api/
│
├── server.js                  # App entry point (Express setup, routes, error handling)
├── package.json                # Dependencies and npm scripts
├── README.md                   # Project documentation
├── .env.example                 # Sample environment variables
├── .gitignore                   # Files/folders excluded from git
│
├── config/
│   └── db.js                    # Read/write helpers for the JSON "database"
│
├── controllers/
│   └── studentController.js     # Business logic for all student operations
│
├── routes/
│   └── studentRoutes.js         # /api/students route definitions
│
├── middleware/
│   ├── errorHandler.js          # Global error handler + 404 handler + ApiError class
│   └── validateStudent.js       # Request body validation for create/update
│
├── utils/
│   └── response.js              # Standardized success/error JSON response helpers
│
└── database/
    └── db.json                  # JSON file used as the data store
```

---

## 3. Features

- Full CRUD REST API for student records
- JSON file–based storage (no external database needed)
- Centralized, consistent success/error response format
- Global error-handling middleware with a custom `ApiError` class
- Request validation middleware with clear, field-level messages
- Duplicate email prevention on create/update
- Optional query filtering on `GET /api/students` (`?course=`, `?search=`)
- Environment variable support via `.env`
- `nodemon` for hot-reload during development
- Proper HTTP status codes throughout (`200`, `201`, `400`, `404`, `500`)

---

## 4. Installation (Windows 11 / PowerShell)

> These commands assume you already have the project folder. If you're building it from scratch, see the "Full Setup Commands" section below.

```powershell
cd student-management-api
npm install
copy .env.example .env
npm run dev
```

The server will start at:

```
http://localhost:5000
```

---

## 5. API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|---------------------------|
| GET    | `/api/students`        | Get all students          |
| GET    | `/api/students/:id`    | Get a single student by id |
| POST   | `/api/students`        | Create a new student      |
| PUT    | `/api/students/:id`    | Update an existing student |
| DELETE | `/api/students/:id`    | Delete a student          |

### Optional Query Parameters (GET /api/students)

| Param    | Example                          | Description                          |
|----------|-----------------------------------|---------------------------------------|
| `course` | `/api/students?course=Computer Science` | Filter students by exact course match |
| `search` | `/api/students?search=priya`      | Search by name or email (partial match) |

---

## 6. Sample Requests

### Create a Student
```
POST /api/students
Content-Type: application/json

{
  "name": "Rohan Gupta",
  "email": "rohan.gupta@example.com",
  "course": "Data Science",
  "age": 23
}
```

### Update a Student
```
PUT /api/students/1
Content-Type: application/json

{
  "name": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "course": "Artificial Intelligence",
  "age": 22
}
```

### Delete a Student
```
DELETE /api/students/1
```

---

## 7. Sample Responses

### Success — GET /api/students
```json
{
  "success": true,
  "message": "Students retrieved successfully.",
  "data": {
    "count": 2,
    "students": [
      {
        "id": 1,
        "name": "Aarav Sharma",
        "email": "aarav.sharma@example.com",
        "course": "Computer Science",
        "age": 21
      },
      {
        "id": 2,
        "name": "Priya Verma",
        "email": "priya.verma@example.com",
        "course": "Information Technology",
        "age": 22
      }
    ]
  }
}
```

### Success — POST /api/students
```json
{
  "success": true,
  "message": "Student created successfully.",
  "data": {
    "id": 3,
    "name": "Rohan Gupta",
    "email": "rohan.gupta@example.com",
    "course": "Data Science",
    "age": 23
  }
}
```

### Error — Student Not Found
```json
{
  "success": false,
  "message": "Student with id 99 not found."
}
```

### Error — Validation Failed
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    "Name is required.",
    "Email format is invalid.",
    "Age must be between 16 and 60."
  ]
}
```

---

## 8. Validation Rules

| Field   | Rule                                             |
|---------|---------------------------------------------------|
| name    | Required, non-empty string                        |
| email   | Required, must match a valid email format          |
| course  | Required, non-empty string                         |
| age     | Required, integer between 16 and 60 (inclusive)     |
| email   | Must be unique across all students (create/update) |

Validation failures return **HTTP 400** with a `success: false` response and an `errors` array listing every failed rule.

---

## 9. HTTP Status Codes Used

| Code | Meaning                | When it's returned                              |
|------|-------------------------|---------------------------------------------------|
| 200  | OK                      | Successful GET / PUT / DELETE                      |
| 201  | Created                 | Successful POST                                     |
| 400  | Bad Request             | Validation errors, invalid id, duplicate email      |
| 404  | Not Found               | Student not found, or unknown route                 |
| 500  | Internal Server Error   | Unexpected server-side failures                     |

---

## 10. Future Improvements

- Add pagination and sorting to `GET /api/students`
- Add authentication (JWT) for write operations
- Migrate storage to a real database (MongoDB/PostgreSQL) behind the same `config/db.js` interface
- Add automated tests (Jest + Supertest)
- Add request-rate limiting and helmet-based security headers
- Add Swagger/OpenAPI documentation

---

## 11. Tech Stack

- **Node.js**
- **Express.js**
- **JSON file storage** (`fs/promises`)
- **dotenv** for environment configuration
- **nodemon** for development hot-reload
