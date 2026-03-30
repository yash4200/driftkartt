const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { protect } = require('../middleware/auth');

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, phone });
    const payload = {
      id: user._id, name: user.name, email: user.email,
      isAdmin: user.isAdmin, isShopkeeper: user.isShopkeeper
    };
    
    res.status(201).json({
      ...payload,
      token: generateToken(payload)
    });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && await user.matchPassword(password)) {
      let shopId = null;
      if (user.isShopkeeper) {
        const shop = await Shop.findOne({ user: user._id });
        if (shop) shopId = shop._id;
      }

      const payload = {
        id: user._id, name: user.name, email: user.email,
        isAdmin: user.isAdmin, isShopkeeper: user.isShopkeeper, shopId
      };

      res.json({
        ...payload,
        token: generateToken(payload)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;