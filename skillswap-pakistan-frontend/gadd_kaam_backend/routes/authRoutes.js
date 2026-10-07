// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const User = require('../models/User');
const keys = require('../config/keys');
const path = require('path');
const fs = require('fs');

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ user: { id: id } }, keys.jwtSecret, { expiresIn: '1d' });
};

// @route   POST /api/auth/register
// @desc    Register user & handle file uploads
// @access  Public
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
      if (req.files) {
        Object.values(req.files).forEach(fileArray => {
          fileArray.forEach(file => {
            fs.unlink(file.path, (err) => {
              if (err) console.error('Error deleting temp file:', err);
            });
          });
        });
      }
      return res.status(400).json({ errors: [{ msg: 'Passwords do not match' }] });
    }

    let profilePicturePath = undefined;
    let cnicFrontPicturePath = undefined;
    let cnicBackPicturePath = undefined;

    try {
      let user = await User.findOne({ $or: [{ username }, { email }, { cnicNumber }] });

      if (user) {
        if (req.files) {
          Object.values(req.files).forEach(fileArray => {
            fileArray.forEach(file => {
              fs.unlink(file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
              });
            });
          });
        }
        if (user.username === username) {
          return res.status(400).json({ errors: [{ msg: 'Username already exists' }] });
        }
        if (user.email === email) {
          return res.status(400).json({ errors: [{ msg: 'Email already registered' }] });
        }
        if (user.cnicNumber === cnicNumber) {
          return res.status(400).json({ errors: [{ msg: 'CNIC number already registered' }] });
        }
      }

      const uploadsDir = path.join(__dirname, '..', 'uploads');

      if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        const oldPath = req.files['profilePicture'][0].path;
        const ext = path.extname(req.files['profilePicture'][0].originalname);
        const newFilename = `profile_picture_${username}${ext}`;
        const newPath = path.join(uploadsDir, newFilename);
        fs.renameSync(oldPath, newPath);
        profilePicturePath = `uploads/${newFilename}`;
      }

      if (req.files && req.files['cnicFrontPicture'] && req.files['cnicFrontPicture'][0]) {
        const oldPath = req.files['cnicFrontPicture'][0].path;
        const ext = path.extname(req.files['cnicFrontPicture'][0].originalname);
        const newFilename = `cnic_front_picture_${cnicNumber}${ext}`;
        const newPath = path.join(uploadsDir, newFilename);
        fs.renameSync(oldPath, newPath);
        cnicFrontPicturePath = `uploads/${newFilename}`;
      }

      if (req.files && req.files['cnicBackPicture'] && req.files['cnicBackPicture'][0]) {
        const oldPath = req.files['cnicBackPicture'][0].path;
        const ext = path.extname(req.files['cnicBackPicture'][0].originalname);
        const newFilename = `cnic_back_picture_${cnicNumber}${ext}`;
        const newPath = path.join(uploadsDir, newFilename);
        fs.renameSync(oldPath, newPath);
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
          profilePicture: user.profilePicture
        }
      });
    } catch (err) {
      console.error(err.message);
      if (profilePicturePath && fs.existsSync(profilePicturePath)) fs.unlinkSync(profilePicturePath);
      if (cnicFrontPicturePath && fs.existsSync(cnicFrontPicturePath)) fs.unlinkSync(cnicFrontPicturePath);
      if (cnicBackPicturePath && fs.existsSync(cnicBackPicturePath)) fs.unlinkSync(cnicBackPicturePath);

      if (req.files) {
        Object.values(req.files).forEach(fileArray => {
          fileArray.forEach(file => {
            if (fs.existsSync(file.path)) {
              fs.unlink(file.path, (err) => {
                if (err) console.error('Error deleting temp/old file on error:', err);
              });
            }
          });
        });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('credential', 'Credential (Email, Username, or CNIC) is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { credential, password } = req.body;

    try {
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
          profilePicture: user.profilePicture
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;