// routes/skillOfferRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SkillOffer = require('../models/SkillOffer');
const User = require('../models/User'); // Import User model
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer storage for skill photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'skill_photos');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create the multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  },
}).single('photo');

// @route   POST /api/skill-offers
// @desc    Create a new skill offer
// @access  Private
router.post(
  '/',
  auth,
  (req, res, next) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ msg: err.message });
      } else if (err) {
        return res.status(400).json({ msg: err.message });
      }
      next();
    });
  },
  [
    check('skills', 'Skills are required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      skills,
      description,
      location,
      remotely,
      anonymous,
      shareWithWomenZone,
      skillsToSwap,
    } = req.body;

    // Parse stringified arrays if necessary (common with FormData from frontend)
    const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    const parsedSkillsToSwap = skillsToSwap && typeof skillsToSwap === 'string' ? JSON.parse(skillsToSwap) : skillsToSwap;

    if (!parsedSkills || parsedSkills.length === 0) {
      return res.status(400).json({ msg: 'Skills array cannot be empty.' });
    }

    try {
      // User is already authenticated via auth middleware (req.user.id)
      // We don't need to fetch the user here to get username/phoneNumber
      // because we're no longer storing them directly on SkillOffer.

      const newSkillOffer = new SkillOffer({
        user: req.user.id, // Store only the user ID, will populate later
        skills: parsedSkills,
        description,
        location,
        remotely: remotely === 'true',
        anonymous: anonymous === 'true', // Store the anonymous flag
        shareWithWomenZone: shareWithWomenZone === 'true',
        skillsToSwap: parsedSkillsToSwap,
        photo: req.file ? `/uploads/skill_photos/${req.file.filename}` : null,
      });

      const skillOffer = await newSkillOffer.save();
      // Populate the user field for the response
      await skillOffer.populate('user', 'username phoneNumber');
      res.json(skillOffer);
    } catch (err) {
      console.error(err.message);
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file on server error:', err);
        });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/skill-offers/marketplace
// @desc    Get all public skill offers for the marketplace (skills not exclusively for women's zone)
// @access  Private (or Public, as per your app design)
router.get('/marketplace', auth, async (req, res) => {
  try {
    // Fetch offers that are NOT exclusively for women's zone.
    // We explicitly populate 'user' to get username and phoneNumber.
    const skillOffers = await SkillOffer.find({ shareWithWomenZone: false })
                                        .populate('user', 'username phoneNumber') // Populate username and phoneNumber
                                        .sort({ date: -1 });
    res.json(skillOffers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/skill-offers/my-skills
// @desc    Get skill offers for the authenticated user
// @access  Private
router.get('/my-skills', auth, async (req, res) => {
  try {
    // Populate 'user' for my-skills as well, even if not strictly needed for display
    // in this specific page, it maintains consistency and can be useful for other logic.
    const skillOffers = await SkillOffer.find({ user: req.user.id })
                                        .populate('user', 'username phoneNumber')
                                        .sort({ date: -1 });
    res.json(skillOffers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/skill-offers/women-only
// @desc    Get skill offers for the women-only zone (must be shared with women's zone)
// @access  Private (only for authenticated female users)
router.get('/women-only', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.gender !== 'Female') {
      return res.status(403).json({ msg: 'Access denied. This zone is for female users only.' });
    }
    // Only show offers that are explicitly shared with the women's zone.
    // Populate 'user' to get username and phoneNumber.
    const skillOffers = await SkillOffer.find({ shareWithWomenZone: true })
                                        .populate('user', 'username phoneNumber')
                                        .sort({ date: -1 });
    res.json(skillOffers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/skill-offers/:offer_id
// @desc    Delete a skill offer
// @access  Private
router.delete('/:offer_id', auth, async (req, res) => {
  try {
    const skillOffer = await SkillOffer.findById(req.params.offer_id);

    if (!skillOffer) {
      return res.status(404).json({ msg: 'Skill offer not found' });
    }

    // Check user authorization
    if (skillOffer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete associated photo if it exists
    if (skillOffer.photo) {
      const filePath = path.join(__dirname, '..', skillOffer.photo);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await skillOffer.deleteOne();

    res.json({ msg: 'Skill offer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
