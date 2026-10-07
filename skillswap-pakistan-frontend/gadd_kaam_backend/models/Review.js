// gadd_kaam_backend/models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  // The user who wrote this review
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The user who received this review
  reviewedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The specific skill offer related to this review (optional, but good for context)
  skillOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillOffer',
    required: false, // Could be null if review is general for user, not tied to one offer
  },
  // The request that led to this review (crucial for linking)
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true,
    unique: true, // A request can only be reviewed once by each participant (or once in total)
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  // Array of skills endorsed during this review (optional)
  endorsedSkills: {
    type: [String], // Array of skill names (e.g., "Web Design", "Tutoring")
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);