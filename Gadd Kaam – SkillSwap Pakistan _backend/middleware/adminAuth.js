const User = require('../models/User');
const auth = require('./auth'); // import jwt auth middleware

// Middleware that combines token verification + admin role check
const adminAuth = [
  auth,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      
      // Check if user exists and has admin role
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ success: false, msg: 'Access denied: Admins only' });
      }
      
      next();
    } catch (err) {
      console.error('Admin Auth Error:', err.message);
      res.status(500).json({ success: false, msg: 'Server error during admin verification' });
    }
  }
];

module.exports = adminAuth;