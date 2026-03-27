require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json());

// 2. MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Database Connected (Atlas)");
    // Yeh check karne ke liye ki models load huye ya nahi
    console.log("Registered Models:", mongoose.modelNames());
  })
  .catch((err) => console.log("❌ DB Error:", err));

// 3. Models Import
// Ensure ki tumhare 'models' folder mein Order.js aur Product.js dono hain
const Order = require('./models/Order');
const Product = require('./models/Product');

// --- ROUTES ---

// Root Route
app.get('/', (req, res) => {
  res.send("DriftKart Backend is Live! 🚀");
});

// A. Products Fetch/Search Route
app.get('/products', async (req, res) => {
  try {
    const { query } = req.query;
    let filter = {};

    if (query && query !== 'undefined') {
      // Name mein search karne ke liye Case-Insensitive regex
      filter = { name: { $regex: query, $options: 'i' } };
    }

    const products = await Product.find(filter);
    console.log(`Found ${products.length} products for query: ${query}`);
    res.json(products);
  } catch (error) {
    console.error("Products Fetch Error:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// B. Order Placement Route
app.post('/api/orders', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "Empty order data" });
    }
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, orderId: savedOrder._id });
  } catch (error) {
    console.error("Order Save Error:", error);
    res.status(500).json({ success: false, message: "Order failed!", error: error.message });
  }
});

// 4. Server Listen
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});