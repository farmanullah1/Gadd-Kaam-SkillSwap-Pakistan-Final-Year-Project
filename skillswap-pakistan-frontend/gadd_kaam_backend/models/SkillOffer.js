// models/SkillOffer.js

const mongoose = require('mongoose');

const SkillOfferSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this offer to a User model
    required: true,
  },
  skills: {
    type: [String], // Array of strings for skills offered
    required: true,
  },
  photo: {
    type: String, // Path to the uploaded photo
    required: false, // Optional photo
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  username: { // Storing username for easy access, but linking to user ID is the source of truth
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  remotely: {
    type: Boolean,
    default: false,
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
  skillsToSwap: {
    type: [String], // Array of strings for skills user wants to learn
    required: false, // Optional
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SkillOffer', SkillOfferSchema);
