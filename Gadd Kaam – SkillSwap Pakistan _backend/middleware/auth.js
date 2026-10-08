// middleware/auth.js
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const auth = (req, res, next) => {
  // Support both x-auth-token and Authorization: Bearer <token>
  let token = req.header('x-auth-token');
  const authHeader = req.header('Authorization');

  if (!token && authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ success: false, msg: 'No token provided, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, keys.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Token is invalid or expired' });
  }
};

module.exports = auth;