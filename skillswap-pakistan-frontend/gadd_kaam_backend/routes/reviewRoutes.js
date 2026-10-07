// gadd_kaam_backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Request = require('../models/Request'); // Needed to check request status and participants
const User = require('../models/User'); // For populating reviewer/reviewedFor details

// @route   POST /api/reviews
// @desc    Submit a new review for a completed skill exchange
// @access  Private
router.post(
  '/',
  auth,
  [
    check('requestId', 'Request ID is required').not().isEmpty(),
    check('rating', 'Rating is required and must be a number between 1 and 5').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { requestId, rating, comment, endorsedSkills } = req.body;
    const reviewerId = req.user.id;

    try {
      // 1. Find the request and ensure it's completed and the current user is a participant
      const request = await Request.findById(requestId);

      if (!request) {
        return res.status(404).json({ msg: 'Skill exchange request not found' });
      }

      // Ensure the request is 'completed'
      if (request.status !== 'completed') {
        return res.status(400).json({ msg: 'Cannot review an uncompleted skill exchange.' });
      }

      // Determine who the reviewedFor user is
      let reviewedForId;
      if (request.sender.toString() === reviewerId) {
        reviewedForId = request.receiver;
      } else if (request.receiver.toString() === reviewerId) {
        reviewedForId = request.sender;
      } else {
        return res.status(401).json({ msg: 'You are not a participant in this skill exchange.' });
      }

      // 2. Check if this specific review (reviewer for this request) already exists
      const existingReview = await Review.findOne({
        reviewer: reviewerId,
        requestId: requestId,
      });

      if (existingReview) {
        return res.status(400).json({ msg: 'You have already submitted a review for this skill exchange.' });
      }

      // 3. Create the new review
      const newReview = new Review({
        reviewer: reviewerId,
        reviewedFor: reviewedForId,
        skillOffer: request.skillOffer, // Link to the skill offer
        requestId: requestId,
        rating,
        comment,
        endorsedSkills: endorsedSkills || [], // Save endorsed skills
      });

      await newReview.save();

      // Optionally: Update the reviewed request to mark that this user has reviewed it
      // This could be done by adding `senderReviewed: Boolean` and `receiverReviewed: Boolean` to the Request model
      // (similar to `senderConfirmedReceived`). For simplicity now, we rely on checking for existing review.

      res.status(201).json({ msg: 'Review submitted successfully!', review: newReview });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/reviews/received
// @desc    Get all reviews received by the authenticated user
// @access  Private
router.get('/received', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedFor: req.user.id })
      .populate('reviewer', ['username', 'profilePicture']) // Populate who wrote the review
      .populate('skillOffer', ['skills']) // Populate the skill that was offered
      .sort({ createdAt: -1 }); // Most recent first

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/reviews/pending
// @desc    Get a list of completed skill exchanges that the authenticated user needs to review
// @access  Private
router.get('/pending', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all completed requests where the user was either sender or receiver
    const completedRequests = await Request.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: 'completed',
    }).populate('sender', ['username', 'profilePicture', 'id'])
      .populate('receiver', ['username', 'profilePicture', 'id'])
      .populate('skillOffer', ['skills']);

    const pendingReviews = [];

    for (const req of completedRequests) {
      // Determine the other participant's ID
      const otherParticipantId = req.sender.toString() === userId ? req.receiver._id : req.sender._id;

      // Check if a review already exists from the current user for this request
      const existingReview = await Review.findOne({
        reviewer: userId,
        requestId: req._id,
      });

      if (!existingReview) {
        // This request is completed, and the current user hasn't reviewed it yet
        pendingReviews.push({
          requestId: req._id,
          skillOffer: req.skillOffer, // The skill offered in the exchange
          skillRequested: req.skillRequested, // The skill requested in return
          otherParticipant: req.sender.toString() === userId ? {
            id: req.receiver._id,
            username: req.receiver.username,
            profilePicture: req.receiver.profilePicture
          } : {
            id: req.sender._id,
            username: req.sender.username,
            profilePicture: req.sender.profilePicture
          },
          // Add a flag to easily tell if current user is sender or receiver of the original request
          isCurrentUserSenderOfRequest: req.sender.toString() === userId
        });
      }
    }

    res.json(pendingReviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;