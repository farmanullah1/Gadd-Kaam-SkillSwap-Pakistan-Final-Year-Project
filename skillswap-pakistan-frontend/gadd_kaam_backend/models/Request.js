const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const RequestSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skillOffer: { type: Schema.Types.ObjectId, ref: 'SkillOffer', required: true },
  skillRequested: { type: String, required: true },
  message: { type: String, required: true },
  isRemote: { type: Boolean, default: false },
  location: { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  senderConfirmedReceived: { type: Boolean, default: false },
  receiverConfirmedReceived: { type: Boolean, default: false },
  messages: [MessageSchema]
}, { timestamps: true });

module.exports = mongoose.models.Request || mongoose.model('Request', RequestSchema);
