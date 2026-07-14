# CampusConnect — Backend

REST API for the CampusConnect Student Management System, built with Node.js, Express, and MongoDB (Mongoose).

## Folder Structure

```
backend/
├── config/
│   └── config.js          # Centralized environment configuration
├── controllers/
│   └── studentController.js
├── database/
│   └── connection.js      # MongoDB connection logic
├── middleware/
│   ├── errorHandler.js
│   ├── notFound.js
│   └── validateStudent.js
├── models/
│   └── Student.js
├── routes/
│   └── studentRoutes.js
├── utils/
│   ├── ApiError.js
│   ├── apiResponse.js
│   └── asyncHandler.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## API Endpoints

| Method | Endpoint             | Description             |
|--------|-----------------------|--------------------------|
| GET    | /api/students          | Get all students         |
| GET    | /api/students/:id      | Get a single student     |
| POST   | /api/students          | Create a new student     |
| PUT    | /api/students/:id      | Update an existing student |
| DELETE | /api/students/:id      | Delete a student         |

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in your MongoDB URI.
3. Run in development: `npm run dev`
4. Run in production: `npm start`

See the main project README for full setup instructions.
