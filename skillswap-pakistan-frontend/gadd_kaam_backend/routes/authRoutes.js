// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const upload = require('../middleware/upload'); // Multer middleware
const User = require('../models/User');
const keys = require('../config/keys');
const path = require('path'); // Import path module
const fs = require('fs');   // Import file system module

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ user: { id: id } }, keys.jwtSecret, { expiresIn: '1h' });
};

// @route   POST /api/auth/register
// @desc    Register user & handle file uploads
// @access  Public
router.post(
  '/register',
  upload, // Multer middleware to handle file uploads
  [
    // ... (Your existing validation checks) ...
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
      // If validation errors, remove uploaded files before returning error
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

    // Check if passwords match
    if (password !== confirmPassword) {
      // Remove uploaded files if passwords don't match
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
      // Check if user already exists (username, email, or CNIC)
      let user = await User.findOne({ $or: [{ username }, { email }, { cnicNumber }] });

      if (user) {
        // Remove uploaded files if user already exists
        if (req.files) {
          Object.values(req.files).forEach(fileArray => {
            fileArray.forEach(file => {
              fs.unlink(file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
              });
            });
          });
        }
        // Return specific error for existing credentials
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

      // --- File Renaming Logic ---
      const uploadsDir = path.join(__dirname, '..', 'uploads'); // Path to uploads directory

      if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        const oldPath = req.files['profilePicture'][0].path; // e.g., 'uploads/profilePicture-123456.png'
        const ext = path.extname(req.files['profilePicture'][0].originalname); // e.g., '.png'
        const newFilename = `profile_picture_${username}${ext}`; // e.g., 'profile_picture_farmanullah.png'
        const newPath = path.join(uploadsDir, newFilename);

        fs.renameSync(oldPath, newPath); // Rename the file synchronously
        profilePicturePath = `uploads/${newFilename}`; // Store new relative path
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
      // --- End File Renaming Logic ---


      // Create new user instance with updated file paths
      user = new User({
        firstName,
        lastName,
        username,
        phoneNumber,
        email,
        dateOfBirth,
        cnicNumber,
        gender,
        password, // Password will be hashed by pre-save hook in model
        profilePicture: profilePicturePath,
        cnicFrontPicture: cnicFrontPicturePath,
        cnicBackPicture: cnicBackPicturePath,
      });

      // Save user to database
      await user.save();

      // Generate and return JWT
      const token = generateToken(user.id);

      res.status(201).json({
        msg: 'User registered successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture // Send back new image path
        }
      });

    } catch (err) {
      console.error(err.message);
      // Ensure any partially uploaded/renamed files are cleaned up on error
      if (profilePicturePath && fs.existsSync(profilePicturePath)) fs.unlinkSync(profilePicturePath);
      if (cnicFrontPicturePath && fs.existsSync(cnicFrontPicturePath)) fs.unlinkSync(cnicFrontPicturePath);
      if (cnicBackPicturePath && fs.existsSync(cnicBackPicturePath)) fs.unlinkSync(cnicBackPicturePath);

      // Also clean up any temporary files that Multer might have saved
      if (req.files) {
        Object.values(req.files).forEach(fileArray => {
          fileArray.forEach(file => {
            if (fs.existsSync(file.path)) { // Check if file still exists (might have been renamed)
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

// ... (Your existing login route below this) ...

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
      // Find user by username, email, or CNIC
      const user = await User.findOne({
        $or: [{ username: credential.toLowerCase() }, { email: credential.toLowerCase() }, { cnicNumber: credential }],
      });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Generate and return JWT
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
          profilePicture: user.profilePicture // Send back image path
        }
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;