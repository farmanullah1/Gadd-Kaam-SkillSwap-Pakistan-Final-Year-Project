// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\+?\d{10,14}$/, 'Please fill a valid phone number (e.g., +923001234567 or 03001234567)'],
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  cnicNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\d{5}-\d{7}-\d{1}$/, 'Please fill a valid CNIC number (e.g., 12345-1234567-1)'],
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'], // Restrict to Male or Female
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
  profilePicture: {
    type: String, // Store path to file
    required: false, // Make optional initially, can be made required later
  },
  cnicFrontPicture: {
    type: String, // Store path to file
    required: false, // Can be made required for verification
  },
  cnicBackPicture: {
    type: String, // Store path to file
    required: false, // Can be made required for verification
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  // Add new fields for profile updates
  location: {
    type: String,
    required: false, // Not required for registration
  },
  aboutMe: {
    type: String,
    required: false, // Not required for registration
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);