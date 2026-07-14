// config/db.js
// This file handles the connection to MongoDB Atlas using mongoose.

const mongoose = require("mongoose");

// This function connects to MongoDB using the connection string
// stored in the .env file (process.env.MONGO_URI)
const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise, so we use await
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
}
};

module.exports = connectDB;
