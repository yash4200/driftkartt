const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 🔥 THE COMPARISON ENGINE: Search and Sort by Price
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        const products = await Product.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { brand: { $regex: q, $options: 'i' } }
            ]
        }).sort({ price: 1 }); // 🚩 Sasta item sabse upar (Best Deal)

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;