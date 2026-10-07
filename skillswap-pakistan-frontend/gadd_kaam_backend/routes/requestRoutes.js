// routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Request = require('../models/Request');
const User = require('../models/User'); // To populate sender/receiver details
const SkillOffer = require('../models/SkillOffer'); // To populate skill offer details
const { check, validationResult } = require('express-validator');

// @route   POST /api/requests/send
// @desc    Send a new skill swap request
// @access  Private
router.post(
  '/send',
  auth,
  [
    check('receiverId', 'Receiver ID is required').not().isEmpty(),
    check('skillOfferId', 'Skill Offer ID is required').not().isEmpty(),
    check('skillRequested', 'Skill you are offering in return is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, skillOfferId, skillRequested } = req.body;
    const senderId = req.user.id; // The authenticated user is the sender

    try {
      // Ensure sender and receiver are not the same user
      if (senderId === receiverId) {
        return res.status(400).json({ msg: 'Cannot send a request to yourself' });
      }

      // Check if the skill offer exists
      const skillOffer = await SkillOffer.findById(skillOfferId);
      if (!skillOffer) {
        return res.status(404).json({ msg: 'Skill offer not found' });
      }

      // Ensure the receiverId matches the owner of the skill offer
      if (skillOffer.user.toString() !== receiverId) {
        return res.status(400).json({ msg: 'Invalid receiver for this skill offer' });
      }

      // Check if a pending request already exists between these users for this skill offer
      const existingRequest = await Request.findOne({
        sender: senderId,
        receiver: receiverId,
        skillOffer: skillOfferId,
        status: 'pending',
      });

      if (existingRequest) {
        return res.status(400).json({ msg: 'You have already sent a pending request for this skill offer.' });
      }

      const newRequest = new Request({
        sender: senderId,
        receiver: receiverId,
        skillOffer: skillOfferId,
        skillRequested,
        status: 'pending',
      });

      await newRequest.save();

      // Populate sender, receiver, and skillOffer details for the response
      const populatedRequest = await Request.findById(newRequest._id)
        .populate('sender', ['username', 'profilePicture'])
        .populate('receiver', ['username', 'profilePicture', 'phoneNumber']) // Include phone number for accepted view
        .populate('skillOffer', ['skills']); // Only skills from the skill offer

      res.status(200).json(populatedRequest);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/requests/received
// @desc    Get all skill swap requests received by the authenticated user
// @access  Private
router.get('/received', auth, async (req, res) => {
  try {
    const requests = await Request.find({ receiver: req.user.id })
      .populate('sender', ['username', 'profilePicture']) // Populate sender's basic info
      .populate('skillOffer', ['skills', 'description', 'photo']) // Populate skill offer info
      .sort({ sentAt: -1 }); // Sort by most recent

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/requests/sent
// @desc    Get all skill swap requests sent by the authenticated user
// @access  Private
router.get('/sent', auth, async (req, res) => {
  try {
    const requests = await Request.find({ sender: req.user.id })
      .populate('receiver', ['username', 'profilePicture', 'phoneNumber']) // Populate receiver's info including phone number
      .populate('skillOffer', ['skills', 'description']) // Populate skill offer info
      .sort({ sentAt: -1 }); // Sort by most recent

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/requests/:requestId/accept
// @desc    Accept a skill swap request
// @access  Private (receiver only)
router.post('/:requestId/accept', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Ensure the authenticated user is the receiver of this request
    if (request.receiver.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to accept this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Request is not pending and cannot be accepted' });
    }

    request.status = 'accepted';
    request.acceptedAt = Date.now();
    await request.save();

    // Populate the request with necessary details for the sender's notification
    const populatedRequest = await Request.findById(request._id)
      .populate('sender', ['username', 'profilePicture'])
      .populate('receiver', ['username', 'profilePicture', 'phoneNumber'])
      .populate('skillOffer', ['skills']);

    res.json(populatedRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/requests/:requestId/cancel
// @desc    Cancel a skill swap request
// @access  Private (sender or receiver)
router.post('/:requestId/cancel', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Ensure the authenticated user is either the sender or the receiver of this request
    if (request.sender.toString() !== req.user.id && request.receiver.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to cancel this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Only pending requests can be cancelled' });
    }

    request.status = 'cancelled';
    await request.save();

    res.json({ msg: 'Request cancelled successfully', requestId: request._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;