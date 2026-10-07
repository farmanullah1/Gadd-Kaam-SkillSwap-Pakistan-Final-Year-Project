// routes/skillOfferRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const uploadSkillPhoto = require('../middleware/uploadSkillPhoto');
const SkillOffer = require('../models/SkillOffer');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// @route   POST /api/skill-offers
// @desc    Create a new skill offer
// @access  Private
router.post(
  '/',
  auth, // Ensure user is authenticated
  (req, res, next) => {
    // Wrap the upload middleware in a custom function to handle errors gracefully
    uploadSkillPhoto(req, res, function (err) {
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
      // If there are validation errors, delete the uploaded file
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { skills, description, location, remotely, anonymous, shareWithWomenZone, skillsToSwap } = req.body;
    
    // Parse skills and skillsToSwap from JSON strings if they were sent that way
    // This is common for form-data mixed with JSON
    const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    const parsedSkillsToSwap = skillsToSwap && typeof skillsToSwap === 'string' ? JSON.parse(skillsToSwap) : skillsToSwap;
    
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      const newSkillOffer = new SkillOffer({
        user: req.user.id,
        skills: parsedSkills,
        description,
        username: anonymous === 'true' ? 'Anonymous User' : user.username,
        phoneNumber: anonymous === 'true' ? 'Contact via platform' : user.phoneNumber,
        location,
        remotely: remotely === 'true',
        anonymous: anonymous === 'true',
        shareWithWomenZone: shareWithWomenZone === 'true', // Handle boolean conversion
        skillsToSwap: parsedSkillsToSwap,
        photo: req.file ? path.basename(req.file.path) : null, // Store only the filename
      });

      const skillOffer = await newSkillOffer.save();
      
      res.json(skillOffer);
    } catch (err) {
      console.error(err.message);
      // If there's a server error, delete the uploaded file
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
// @desc    Get all skill offers (for marketplace)
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
// @desc    Get skill offers by the authenticated user
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
// @desc    Get skill offers shared specifically for the women-only zone
// @access  Private (only accessible by authenticated female users)
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
    
    // Check if user is authorized to delete this offer
    if (skillOffer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Delete the associated photo file if it exists
    if (skillOffer.photo) {
      const filePath = path.join(__dirname, '..', 'uploads', 'skill_photos', skillOffer.photo);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    await skillOffer.deleteOne(); // Use deleteOne() instead of remove()
    
    res.json({ msg: 'Skill offer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;