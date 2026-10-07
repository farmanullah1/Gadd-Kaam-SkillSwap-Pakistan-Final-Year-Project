// gadd_kaam_backend/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // For protecting routes
const Request = require('../models/Request');
const User = require('../models/User'); // Import User model to populate sender/receiver details
const SkillOffer = require('../models/SkillOffer'); // Import SkillOffer model to populate skill details
const { check, validationResult } = require('express-validator'); // Import for validation

// @route   POST api/requests
// @desc    Send a skill swap request
// @access  Private
// This route now handles sending requests, replacing the old /api/requests/send
router.post('/', auth, [
    check('receiverId', 'Receiver ID is required').not().isEmpty(),
    check('skillOfferId', 'Skill Offer ID is required').not().isEmpty(),
    check('skillRequested', 'Skill you are offering in return is required').not().isEmpty(),
    check('message', 'Initial message is required').not().isEmpty(), // Ensure initial message is present
    check('isRemote', 'Remote status is required').isBoolean(),
    check('location', 'Location must be a string if provided').optional({ nullable: true }).isString(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, skillOfferId, skillRequested, message, isRemote, location } = req.body;
    const senderId = req.user.id;

    // Basic validation for location based on isRemote
    if (!isRemote && (!location || location.trim() === '')) {
        return res.status(400).json({ msg: 'Location is required for non-remote requests.' });
    }

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
            message, // Store the initial message
            isRemote,
            location: isRemote ? '' : location // Clear location if remote
        });

        const request = await newRequest.save();

        // FIX: Robust way to populate a newly saved document
        const populatedRequest = await Request.findById(request._id)
            .populate('sender', 'username profilePicture')
            .populate('receiver', 'username profilePicture')
            .populate('skillOffer', 'skills');

        res.status(201).json(populatedRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/requests/received
// @desc    Get all requests received by the authenticated user
// @access  Private
// NOTE: Frontend primarily uses GET /api/requests/ for consolidated list
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

// @route   GET api/requests/sent
// @desc    Get all requests sent by the authenticated user
// @access  Private
// NOTE: Frontend primarily uses GET /api/requests/ for consolidated list
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

// NEW/UPDATED: @route   GET api/requests/
// @desc    Get all requests where the user is either sender or receiver (for messages and received requests pages)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const requests = await Request.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        })
        .populate('sender', 'username profilePicture location phoneNumber')
        .populate('receiver', 'username profilePicture location phoneNumber')
        .populate('skillOffer', 'skills')
        .sort({ updatedAt: -1 }); // Sort by most recently updated for messages page activity

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/requests/:id/accept
// @desc    Accept a skill swap request
// @access  Private (Receiver only)
router.post('/:id/accept', auth, async (req, res) => {
    try {
        let request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: 'Request not found' });
        }

        // Ensure only the receiver can accept
        if (request.receiver.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to accept this request' });
        }

        if (request.status !== 'pending') {
          return res.status(400).json({ msg: 'Request is not pending and cannot be accepted' });
        }

        request.status = 'accepted';
        await request.save();

        // FIX: Robust way to populate an updated document
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

// @route   POST api/requests/:id/cancel
// @desc    Cancel a skill swap request (by sender or receiver)
// @access  Private
router.post('/:id/cancel', auth, async (req, res) => {
    try {
        let request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: 'Request not found' });
        }

        // Allow sender or receiver to cancel
        if (request.sender.toString() !== req.user.id && request.receiver.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to cancel this request' });
        }

        if (request.status !== 'pending' && request.status !== 'accepted') { // Can cancel pending or accepted requests
            return res.status(400).json({ msg: 'Request cannot be cancelled in its current state.' });
        }

        request.status = 'cancelled';
        await request.save();

        res.json({ msg: 'Request cancelled successfully', request }); // Send back the updated request
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// NEW/UPDATED: @route   POST api/requests/:id/confirm-skill-received
// @desc    Confirm skill received for a request by either participant
// @access  Private
router.post('/:id/confirm-skill-received', auth, async (req, res) => {
    try {
        let request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: 'Request not found' });
        }

        const userId = req.user.id;

        if (request.status !== 'accepted') {
            return res.status(400).json({ msg: 'Skill can only be confirmed for accepted requests.' });
        }

        let updated = false;
        if (request.sender.toString() === userId) {
            if (request.senderConfirmedReceived) {
                return res.status(400).json({ msg: 'You have already confirmed this skill exchange.' });
            }
            request.senderConfirmedReceived = true;
            updated = true;
        } else if (request.receiver.toString() === userId) {
            if (request.receiverConfirmedReceived) {
                return res.status(400).json({ msg: 'You have already confirmed this skill exchange.' });
            }
            request.receiverConfirmedReceived = true;
            updated = true;
        } else {
            return res.status(401).json({ msg: 'User not authorized to confirm this request.' });
        }

        if (updated) {
            // If both parties have confirmed, set status to 'completed'
            if (request.senderConfirmedReceived && request.receiverConfirmedReceived) {
                request.status = 'completed';
            }
            await request.save();
        }

        // FIX: Robust way to populate an updated document
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

// NEW: @route   POST api/requests/:id/messages
// @desc    Add a message to a specific request's chat
// @access  Private (Only sender or receiver of the request)
router.post('/:id/messages', auth, async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ msg: 'Message text is required.' });
    }

    try {
        let request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: 'Request not found.' });
        }

        // Check if the authenticated user is either the sender or receiver of the request
        const isParticipant = request.sender.toString() === req.user.id || request.receiver.toString() === req.user.id;
        if (!isParticipant) {
            return res.status(401).json({ msg: 'User not authorized to send messages in this conversation.' });
        }

        // Prevent sending messages if the exchange is completed
        if (request.status === 'completed') {
            return res.status(400).json({ msg: 'This exchange has been completed. Messages cannot be sent.' });
        }

        const newMessage = {
            sender: req.user.id,
            text: text,
            timestamp: new Date()
        };

        request.messages.push(newMessage);
        await request.save();

        // To return the message with populated sender details for the frontend
        // FIX: Populate the specific message's sender
        const sentMessage = request.messages[request.messages.length - 1]; // Get the last message added
        // The sender needs to be populated on the MESSAGE itself if it's an embedded sub-document
        // However, a direct populate on sentMessage won't work if it's not a Mongoose document.
        // It's usually better to send back just the message and have the frontend populate/display based on context,
        // or re-fetch the entire request with populated messages if absolutely necessary.
        // For simplicity, we'll try to populate the sub-document's reference if Mongoose supports it directly
        // on a saved subdocument. If not, the frontend will need to handle user lookup.

        // A more robust way to send back the populated message would be to re-fetch the parent request:
        const updatedRequestWithPopulatedMessage = await Request.findById(request._id)
            .populate('messages.sender', 'username profilePicture')
            .select('messages'); // Only select messages field

        const latestPopulatedMessage = updatedRequestWithPopulatedMessage.messages[updatedRequestWithPopulatedMessage.messages.length - 1];

        res.status(201).json(latestPopulatedMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// NEW: @route   GET api/requests/:id/messages
// @desc    Get all messages for a specific request's chat
// @access  Private (Only sender or receiver of the request)
router.get('/:id/messages', auth, async (req, res) => {
    try {
        // Find the request and populate the sender of each message in the messages array
        const request = await Request.findById(req.params.id)
            .populate('messages.sender', 'username profilePicture')
            .select('messages status sender receiver'); // Also select status and participants for frontend validation

        if (!request) {
            return res.status(404).json({ msg: 'Request not found.' });
        }

        // Check if the authenticated user is either the sender or receiver of the request
        const isParticipant = request.sender.toString() === req.user.id || request.receiver.toString() === req.user.id;
        if (!isParticipant) {
            return res.status(401).json({ msg: 'User not authorized to view messages in this conversation.' });
        }

        res.json(request.messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
