const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SkillOffer = require('../models/SkillOffer');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer storage
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

    const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    const parsedSkillsToSwap = skillsToSwap && typeof skillsToSwap === 'string' ? JSON.parse(skillsToSwap) : skillsToSwap;

    if (!parsedSkills || parsedSkills.length === 0) {
      return res.status(400).json({ msg: 'Skills array cannot be empty.' });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const newSkillOffer = new SkillOffer({
        user: req.user.id,
        skills: parsedSkills,
        description,
        username: anonymous === 'true' ? 'Anonymous' : user.username,
        phoneNumber: anonymous === 'true' ? 'Hidden' : user.phoneNumber,
        location,
        remotely: remotely === 'true',
        anonymous: anonymous === 'true',
        shareWithWomenZone: shareWithWomenZone === 'true',
        skillsToSwap: parsedSkillsToSwap,
        photo: req.file ? `/uploads/skill_photos/${req.file.filename}` : null,
      });

      const skillOffer = await newSkillOffer.save();
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

// @route   GET /api/skill-offers
// @desc    Get all skill offers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const skillOffers = await SkillOffer.find().sort({ date: -1 });
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
    const skillOffers = await SkillOffer.find({ user: req.user.id }).sort({ date: -1 });
    res.json(skillOffers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/skill-offers/women-only
// @desc    Get skill offers for the women-only zone
// @access  Private (only for authenticated female users)
router.get('/women-only', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.gender !== 'Female') {
      return res.status(403).json({ msg: 'Access denied. This zone is for female users only.' });
    }

    const skillOffers = await SkillOffer.find({ shareWithWomenZone: true }).sort({ date: -1 });
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

    if (skillOffer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

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