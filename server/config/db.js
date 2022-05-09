const mongoose = require("mongoose");
require('dotenv').config()
const db = process.env.MONGO_URI
const connectDb = async () => {
  try {
    await mongoose.connect(db);
    console.log('Connected to db');
  } catch (error) {
    console.log(error.message);
    process.exit(1)
  }
};

module.exports = connectDb