// models/SkillSuggestion.js
const mongoose = require('mongoose');

const SkillSuggestionSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  suggestionCount: {
    type: Number,
    default: 1,
  },
  lastSuggested: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SkillSuggestion', SkillSuggestionSchema);