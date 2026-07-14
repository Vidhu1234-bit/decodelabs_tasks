// server.js
// Entry point of the CampusConnect backend application

const express = require('express');
const cors = require('cors');

const config = require('./config/config');
const connectDB = require('./database/connection');

const studentRoutes = require('./routes/studentRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Connect to MongoDB
connectDB();

const app = express();

// ---------- Global Middleware ----------
app.use(
  cors({
    origin: config.clientOrigin === '*' ? '*' : config.clientOrigin,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Health Check Route ----------
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the CampusConnect API 🎓',
    endpoints: {
      getAllStudents: 'GET /api/students',
      getStudentById: 'GET /api/students/:id',
      createStudent: 'POST /api/students',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id',
    },
  });
});

// ---------- API Routes ----------
app.use('/api/students', studentRoutes);

// ---------- Error Handling Middleware (must be last) ----------
app.use(notFound);
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 CampusConnect server running in ${config.nodeEnv} mode on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});
