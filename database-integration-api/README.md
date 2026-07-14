# Student Management API

A simple, beginner-friendly REST API for managing student records, built with **Node.js**, **Express.js**, and **MongoDB Atlas** (via **Mongoose**). This is a backend-only project (no frontend).

---

## 1. Project Overview

This API allows you to perform full CRUD (Create, Read, Update, Delete) operations on student records. Each student has a name, email, course, age, and a creation timestamp.

**Tech stack:**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- cors
- nodemon (for development)

---

## 2. Folder Structure

```
database-integration-api
│
├── config
│      db.js                  -> MongoDB connection logic
│
├── controllers
│      studentController.js   -> CRUD logic for students
│
├── database
│      Student.js              -> Mongoose schema/model
│
├── middleware
│      errorHandler.js         -> Centralized error handling
│
├── routes
│      studentRoutes.js        -> API routes
│
├── utils
│      response.js              -> Success/Error response helpers
│
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## 3. Installation (Windows)

Open **PowerShell** or **Command Prompt** and run the following commands.

### Step 1: Create the project folder and move into it

```powershell
mkdir database-integration-api
cd database-integration-api
```

> If you already have the project files (from this generation), just navigate into the folder instead:
> ```powershell
> cd database-integration-api
> ```

### Step 2: Initialize npm (only needed if package.json does not already exist)

```powershell
npm init -y
```

### Step 3: Install dependencies

```powershell
npm install express mongoose dotenv cors
```

### Step 4: Install nodemon as a dev dependency

```powershell
npm install --save-dev nodemon
```

---

## 4. Environment Variables

Create a file named `.env` in the root folder (same level as `server.js`) and copy the contents of `.env.example` into it:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/student_management?retryWrites=true&w=majority
PORT=5000
```

Replace `<username>`, `<password>`, and `<cluster-url>` with your actual MongoDB Atlas credentials (see below).

> **Windows tip:** You can create the file using PowerShell:
> ```powershell
> copy .env.example .env
> ```
> Then open `.env` in Notepad to edit it:
> ```powershell
> notepad .env
> ```

---

## 5. MongoDB Atlas Setup

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign in or create a free account.
2. Create a new **Project**, then create a free **Cluster** (M0 tier).
3. Under **Database Access**, create a new database user with a username and password.
4. Under **Network Access**, add your current IP address, or allow access from anywhere (`0.0.0.0/0`) for development/testing.
5. Once the cluster is ready, click **Connect** → **Drivers** → copy the connection string.
6. Paste the connection string into your `.env` file as the value of `MONGO_URI`, replacing `<username>` and `<password>` with your database user credentials.

---

## 6. Run Commands (Windows PowerShell)

### Run in development mode (auto-restarts on file changes)

```powershell
npm run dev
```

### Run in production mode

```powershell
npm start
```

If everything is set up correctly, you should see:

```
Database Connected
Server running on port 5000
```

---

## 7. API Endpoints

Base URL: `http://localhost:5000/api/students`

| Method | Endpoint              | Description             |
|--------|------------------------|--------------------------|
| POST   | /api/students          | Create a new student     |
| GET    | /api/students          | Get all students         |
| GET    | /api/students/:id      | Get a single student     |
| PUT    | /api/students/:id      | Update a student         |
| DELETE | /api/students/:id      | Delete a student         |

---

## 8. Sample JSON

### Create Student (POST /api/students)

```json
{
  "name": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "course": "Computer Science",
  "age": 21
}
```

### Update Student (PUT /api/students/:id)

```json
{
  "name": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "course": "Data Science",
  "age": 22
}
```

---

## 9. Expected Responses

### Success (Create - 201)

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "665f1c2e4b3a2f0012345678",
    "name": "Rahul Sharma",
    "email": "rahul.sharma@example.com",
    "course": "Computer Science",
    "age": 21,
    "createdAt": "2026-07-14T10:00:00.000Z"
  }
}
```

### Success (Get All - 200)

```json
{
  "success": true,
  "message": "Students fetched successfully",
  "data": [
    {
      "_id": "665f1c2e4b3a2f0012345678",
      "name": "Rahul Sharma",
      "email": "rahul.sharma@example.com",
      "course": "Computer Science",
      "age": 21,
      "createdAt": "2026-07-14T10:00:00.000Z"
    }
  ]
}
```

### Failure (Missing Fields - 400)

```json
{
  "success": false,
  "message": "Please provide name, email, course and age"
}
```

### Failure (Duplicate Email - 400)

```json
{
  "success": false,
  "message": "Email already exists"
}
```

### Failure (Invalid ID - 400)

```json
{
  "success": false,
  "message": "Invalid student ID"
}
```

### Failure (Student Not Found - 404)

```json
{
  "success": false,
  "message": "Student not found"
}
```

---

## 10. Testing with Postman / Thunder Client

### 1. Create Student
- Method: `POST`
- URL: `http://localhost:5000/api/students`
- Body (JSON):
```json
{
  "name": "Priya Verma",
  "email": "priya.verma@example.com",
  "course": "Mechanical Engineering",
  "age": 20
}
```

### 2. Get All Students
- Method: `GET`
- URL: `http://localhost:5000/api/students`

### 3. Get One Student
- Method: `GET`
- URL: `http://localhost:5000/api/students/<student_id>`

### 4. Update Student
- Method: `PUT`
- URL: `http://localhost:5000/api/students/<student_id>`
- Body (JSON):
```json
{
  "name": "Priya Verma",
  "email": "priya.verma@example.com",
  "course": "Electrical Engineering",
  "age": 21
}
```

### 5. Delete Student
- Method: `DELETE`
- URL: `http://localhost:5000/api/students/<student_id>`

---

## 11. Final Checklist

- [x] Express server configured
- [x] MongoDB Atlas connected via Mongoose
- [x] Student schema with validation (required fields, unique email)
- [x] Full CRUD API implemented
- [x] Proper HTTP status codes (200, 201, 400, 404, 500)
- [x] Centralized error handling (no server crashes)
- [x] Consistent success/failure JSON response format
- [x] .env.example provided (no secrets committed)
- [x] .gitignore configured (node_modules, .env excluded)
- [x] README with Windows-specific setup instructions

---

You're all set! Run `npm install` followed by `npm run dev`, and your Student Management API will be live at `http://localhost:5000`.
