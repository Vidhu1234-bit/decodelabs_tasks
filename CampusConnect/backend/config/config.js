// config/config.js
// Centralized configuration loaded from environment variables

require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusconnect',
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
};

module.exports = config;
