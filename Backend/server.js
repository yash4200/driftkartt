require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json());

// 2. MongoDB Connection
// Note: Make sure MONGO_URI is set in Render Environment Variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Connected (Atlas)"))
  .catch((err) => console.log("❌ DB Error:", err));

// 3. Model Import
// Make sure you have 'models/Order.js' file in your Backend folder
const Order = require('./models/Order');

// --- ROUTES ---

// A. Root Route (Testing ke liye)
app.get('/', (req, res) => {
  res.send("DriftKart Backend is Live and Running! 🚀");
});

// B. Products Route (Frontend error fix karne ke liye)
app.get('/products', async (req, res) => {
  try {
    // Abhi ke liye empty array bhej rahe hain taaki frontend crash na ho
    // Jab tum products database mein daaloge, tab yahan se fetch kar lena
    res.json([]); 
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// C. Order Post Route (Checkout ke liye)
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ 
      success: true, 
      orderId: savedOrder._id,
      message: "Order placed successfully!" 
    });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ success: false, message: "Order failed!" });
  }
});

// 4. Server Listen
// Render dynamically assigns a port, so we use process.env.PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});