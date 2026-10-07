// routes/adminRoutes.js
const express = require('express');
const User = require('../models/User');
const SkillOffer = require('../models/SkillOffer');
const Report = require('../models/Report');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all skills
router.get('/skills', adminAuth, async (req, res) => {
  try {
    const skills = await SkillOffer.find();
    res.json(skills);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete skill
router.delete('/skills/:id', adminAuth, async (req, res) => {
  try {
    await SkillOffer.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Skill deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all reports
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'username email')
      .populate('reportedUser', 'username email')
      .populate('reportedSkill', 'title');
    res.json(reports);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get stats (dashboard numbers)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const skillCount = await SkillOffer.countDocuments();
    const reportCount = await Report.countDocuments();

    res.json({
      users: userCount,
      skills: skillCount,
      reports: reportCount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
