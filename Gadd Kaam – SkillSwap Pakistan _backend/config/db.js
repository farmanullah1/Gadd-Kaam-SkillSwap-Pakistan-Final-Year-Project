// config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Suppress the DeprecationWarning for strictQuery
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap_pakistan';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;