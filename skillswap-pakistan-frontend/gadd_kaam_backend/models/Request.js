// models/Request.js
const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  // The user who sent the request
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The user who receives the request (owner of the skill offer)
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The specific skill offer being requested
  skillOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillOffer',
    required: true,
  },
  // The skill the sender wants in return for the swap
  skillRequested: {
    type: String,
    required: true,
    maxlength: 500, // Limit the length of the requested skill description
  },
  // Status of the request: 'pending', 'accepted', 'cancelled'
  status: {
    type: String,
    enum: ['pending', 'accepted', 'cancelled'],
    default: 'pending',
  },
  // Timestamp when the request was sent
  sentAt: {
    type: Date,
    default: Date.now,
  },
  // Timestamp when the request was accepted (if applicable)
  acceptedAt: {
    type: Date,
  },
});

module.exports = mongoose.models.Request || mongoose.model('Request', RequestSchema);