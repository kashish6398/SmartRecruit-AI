const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // db.js
const conn = await mongoose.connect(process.env.MONGODB_URI, {
  family: 4 // Ye line Node.js ko batayegi ki sirf IPv4 (normal internet) use kare
});

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
