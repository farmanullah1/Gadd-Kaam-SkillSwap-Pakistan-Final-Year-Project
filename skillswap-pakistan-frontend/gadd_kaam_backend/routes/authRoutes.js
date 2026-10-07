const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const User = require('../models/User');
const keys = require('../config/keys');
const path = require('path');
const fs = require('fs');

const generateToken = (id) => {
  return jwt.sign({ user: { id: id } }, keys.jwtSecret, { expiresIn: '1d' });
};

// @route   POST api/auth/register
router.post(
  '/register',
  upload,
  [
    check('firstName', 'First Name is required').not().isEmpty(),
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
    check('email', 'Please include a valid email').isEmail(),
    check('phoneNumber', 'Phone Number is required').not().isEmpty(),
    check('dateOfBirth', 'Date of Birth is required').not().isEmpty(),
    check('cnicNumber', 'CNIC Number is required').not().isEmpty(),
    check('cnicNumber', 'Please enter a valid CNIC format (e.g., XXXXX-XXXXXXX-X)').matches(/^\d{5}-\d{7}-\d{1}$/),
    check('gender', 'Gender is required').isIn(['Male', 'Female']),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('confirmPassword', 'Confirm Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.files) {
        Object.values(req.files).forEach(fileArray => {
          fileArray.forEach(file => {
            fs.unlink(file.path, (err) => {
              if (err) console.error('Error deleting temp file:', err);
            });
          });
        });
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      username,
      phoneNumber,
      email,
      dateOfBirth,
      cnicNumber,
      gender,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ errors: [{ msg: 'Passwords do not match' }] });
    }

    let profilePicturePath = undefined;
    let cnicFrontPicturePath = undefined;
    let cnicBackPicturePath = undefined;

    try {
      let user = await User.findOne({ $or: [{ username }, { email }, { cnicNumber }] });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User with these credentials already exists' }] });
      }

      const uploadsDir = path.join(__dirname, '..', 'uploads');

      if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        const file = req.files['profilePicture'][0];
        const newFilename = `profile_picture_${username}${path.extname(file.originalname)}`;
        fs.renameSync(file.path, path.join(uploadsDir, newFilename));
        profilePicturePath = `uploads/${newFilename}`;
      }

      if (req.files && req.files['cnicFrontPicture'] && req.files['cnicFrontPicture'][0]) {
        const file = req.files['cnicFrontPicture'][0];
        const newFilename = `cnic_front_${cnicNumber}${path.extname(file.originalname)}`;
        fs.renameSync(file.path, path.join(uploadsDir, newFilename));
        cnicFrontPicturePath = `uploads/${newFilename}`;
      }

      if (req.files && req.files['cnicBackPicture'] && req.files['cnicBackPicture'][0]) {
        const file = req.files['cnicBackPicture'][0];
        const newFilename = `cnic_back_${cnicNumber}${path.extname(file.originalname)}`;
        fs.renameSync(file.path, path.join(uploadsDir, newFilename));
        cnicBackPicturePath = `uploads/${newFilename}`;
      }

      user = new User({
        firstName,
        lastName,
        username,
        phoneNumber,
        email,
        dateOfBirth,
        cnicNumber,
        gender,
        password,
        profilePicture: profilePicturePath,
        cnicFrontPicture: cnicFrontPicturePath,
        cnicBackPicture: cnicBackPicturePath,
        role: 'user' // Default role is user
      });

      await user.save();
      const token = generateToken(user.id);

      res.status(201).json({
        msg: 'User registered successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
          role: user.role // ✅ SENT ROLE HERE
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/auth/login
router.post(
  '/login',
  [
    check('credential', 'Credential is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { credential, password } = req.body;

    try {
      // Find by username OR email OR cnic
      const user = await User.findOne({
        $or: [{ username: credential.toLowerCase() }, { email: credential.toLowerCase() }, { cnicNumber: credential }],
      });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Check if user is banned
      if (user.isBanned) {
        return res.status(403).json({ msg: 'Your account has been banned. Contact support.' });
      }

      const token = generateToken(user.id);

      res.status(200).json({
        msg: 'Logged in successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
          role: user.role // ✅ CRITICAL: Sending role to frontend
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;