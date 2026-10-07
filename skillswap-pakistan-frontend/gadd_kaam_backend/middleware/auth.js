// middleware/auth.js
const jwt = require('jsonwebtoken');
const keys = require('../config/keys'); // Import your keys

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token'); // Common header for JWT

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, keys.jwtSecret); // Use your secret key
    req.user = decoded.user; // Attach user information from token payload
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;