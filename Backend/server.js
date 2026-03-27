require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

const Order = require('./models/Order');
const Product = require('./models/Product'); // Naya model

// Root Route
app.get('/', (req, res) => res.send("DriftKart Backend Live! 🚀"));

// --- [UPDATED] Products Route ---
app.get('/products', async (req, res) => {
  try {
    const { query } = req.query;
    let filter = {};
    if (query) {
      // Name mein search karne ke liye logic
      filter = { name: { $regex: query, $options: 'i' } };
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Order Route
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ success: true, orderId: newOrder._id });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));