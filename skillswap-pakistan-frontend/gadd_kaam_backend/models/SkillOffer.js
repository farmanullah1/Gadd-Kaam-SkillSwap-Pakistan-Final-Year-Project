const mongoose = require('mongoose');

// Check if the model already exists before defining it
const SkillOfferSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  username: {
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
  shareWithWomenZone: {
    type: Boolean,
    default: false,
  },
  skillsToSwap: {
    type: [String],
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.SkillOffer || mongoose.model('SkillOffer', SkillOfferSchema);