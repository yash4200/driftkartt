const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

// Saari shops fetch karne ke liye
router.get('/', async (req, res) => {
    try {
        const shops = await Shop.find();
        res.json(shops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;