const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Request = require('../models/Request');
const User = require('../models/User');
const SkillOffer = require('../models/SkillOffer');
const { check, validationResult } = require('express-validator');

// =======================
// Create a new request
// =======================
router.post(
  '/',
  auth,
  [
    check('receiverId', 'Receiver ID is required').not().isEmpty(),
    check('skillOfferId', 'Skill Offer ID is required').not().isEmpty(),
    check('skillRequested', 'Skill you are offering in return is required').not().isEmpty(),
    check('message', 'Initial message is required').not().isEmpty(),
    check('isRemote', 'Remote status is required').isBoolean(),
    check('location', 'Location must be a string if provided').optional({ nullable: true }).isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { receiverId, skillOfferId, skillRequested, message, isRemote, location } = req.body;
    const senderId = req.user.id;

    if (!isRemote && (!location || location.trim() === '')) {
      return res.status(400).json({ msg: 'Location is required for non-remote requests.' });
    }

    try {
      if (senderId === receiverId) {
        return res.status(400).json({ msg: 'Cannot send a request to yourself' });
      }

      const skillOffer = await SkillOffer.findById(skillOfferId);
      if (!skillOffer) return res.status(404).json({ msg: 'Skill offer not found' });

      if (skillOffer.user.toString() !== receiverId) {
        return res.status(400).json({ msg: 'Invalid receiver for this skill offer' });
      }

      const existingRequest = await Request.findOne({
        sender: senderId,
        receiver: receiverId,
        skillOffer: skillOfferId,
        status: 'pending',
      });

      if (existingRequest) {
        return res.status(400).json({ msg: 'You already have a pending request for this skill offer.' });
      }

      const newRequest = new Request({
        sender: senderId,
        receiver: receiverId,
        skillOffer: skillOfferId,
        skillRequested,
        message,
        isRemote,
        location: isRemote ? '' : location,
      });

      const request = await newRequest.save();

      const populatedRequest = await Request.findById(request._id)
        .populate('sender', 'username profilePicture')
        .populate('receiver', 'username profilePicture')
        .populate('skillOffer', 'skills');

      res.status(201).json(populatedRequest);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// =======================
// Get received requests
// =======================
router.get('/received', auth, async (req, res) => {
  try {
    const requests = await Request.find({ receiver: req.user.id })
      .populate('sender', 'username profilePicture location phoneNumber')
      .populate('skillOffer', 'skills')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// =======================
// Get sent requests
// =======================
router.get('/sent', auth, async (req, res) => {
  try {
    const requests = await Request.find({ sender: req.user.id })
      .populate('receiver', 'username profilePicture location phoneNumber')
      .populate('skillOffer', 'skills')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// =======================
// Get all requests (sent + received)
// =======================
router.get('/', auth, async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate('sender', 'username profilePicture location phoneNumber')
      .populate('receiver', 'username profilePicture location phoneNumber')
      .populate('skillOffer', 'skills')
      .sort({ updatedAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// =======================
// Accept a request
// =======================
router.post('/:id/accept', auth, async (req, res) => {
  try {
    let request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    if (request.receiver.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to accept this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Request is not pending and cannot be accepted' });
    }

    request.status = 'accepted';
    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('sender', 'username profilePicture location phoneNumber')
      .populate('receiver', 'username profilePicture location phoneNumber')
      .populate('skillOffer', 'skills');

    res.json(populatedRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// =======================
// Cancel a request
// =======================
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    let request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    if (request.sender.toString() !== req.user.id && request.receiver.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to cancel this request' });
    }

    if (!['pending', 'accepted'].includes(request.status)) {
      return res.status(400).json({ msg: 'Request cannot be cancelled in its current state' });
    }

    request.status = 'cancelled';
    await request.save();

    res.json({ msg: 'Request cancelled successfully', request });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// =======================
// Confirm skill received
// =======================
router.post('/:id/confirm-skill-received', auth, async (req, res) => {
  try {
    let request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    if (request.status !== 'accepted') {
      return res.status(400).json({ msg: 'Can only confirm skills for accepted requests' });
    }

    const userId = req.user.id;
    let updated = false;

    if (request.sender.toString() === userId) {
      if (request.senderConfirmedReceived) {
        return res.status(400).json({ msg: 'You already confirmed this skill exchange' });
      }
      request.senderConfirmedReceived = true;
      updated = true;
    } else if (request.receiver.toString() === userId) {
      if (request.receiverConfirmedReceived) {
        return res.status(400).json({ msg: 'You already confirmed this skill exchange' });
      }
      request.receiverConfirmedReceived = true;
      updated = true;
    } else {
      return res.status(401).json({ msg: 'Not authorized to confirm this request' });
    }

    if (updated && request.senderConfirmedReceived && request.receiverConfirmedReceived) {
      request.status = 'completed';
    }

    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('sender', 'username profilePicture location phoneNumber')
      .populate('receiver', 'username profilePicture location phoneNumber')
      .populate('skillOffer', 'skills');

    res.json({ msg: 'Skill received confirmed!', request: populatedRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// =======================
// Add message to request chat
// =======================
router.post('/:id/messages', auth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ msg: 'Message text is required' });

  try {
    let request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    const isParticipant = request.sender.toString() === req.user.id || request.receiver.toString() === req.user.id;
    if (!isParticipant) return res.status(401).json({ msg: 'Not authorized to send messages here' });

    if (request.status === 'completed') {
      return res.status(400).json({ msg: 'Exchange completed. No more messages allowed' });
    }

    const newMessage = { sender: req.user.id, text, timestamp: new Date() };
    request.messages.push(newMessage);
    await request.save();

    const updatedRequest = await Request.findById(req.params.id)
      .populate('messages.sender', 'username profilePicture')
      .select('messages');

    const latestMessage = updatedRequest.messages[updatedRequest.messages.length - 1];
    res.status(201).json(latestMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// =======================
// Get messages for a request
// =======================
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('messages.sender', 'username profilePicture')
      .select('messages status sender receiver');

    if (!request) return res.status(404).json({ msg: 'Request not found' });

    const isParticipant = request.sender.toString() === req.user.id || request.receiver.toString() === req.user.id;
    if (!isParticipant) return res.status(401).json({ msg: 'Not authorized to view messages' });

    res.json(request.messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
