// database/connection.js
// Handles the MongoDB connection using Mongoose

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require('mongoose');
const config = require('../config/config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Gracefully handle disconnects
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

module.exports = connectDB;
