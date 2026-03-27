require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express(); // <--- Yeh define hona zaroori hai

// Middlewares
app.use(cors());
app.use(express.json()); // Taaki frontend ka data backend samajh sake

// MongoDB Connection Logic
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Connected (Atlas)"))
  .catch((err) => console.log("❌ DB Error:", err));

// Model Import (Check karna ki file path sahi ho)
const Order = require('./models/Order');

// API Route: Order save karne ke liye
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, orderId: savedOrder._id });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ success: false, message: "Order failed!" });
  }
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});