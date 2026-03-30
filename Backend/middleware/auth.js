const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect: must be logged in
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    // Also attach shopId from token payload directly onto req.user if present
    if (decoded.shopId) {
      req.user.shopId = decoded.shopId;
    }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired, please login again', isExpired: true });
    }
    res.status(401).json({ message: 'Token invalid' });
  }
};

module.exports = { protect };