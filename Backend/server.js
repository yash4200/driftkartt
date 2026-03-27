require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json());

// 2. MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://driftkartt:Yash12345@driftkart.okfymoi.mongodb.net/driftkart?retryWrites=true&w=majority&appName=driftkart";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Database Connected (Atlas)");
    console.log("Registered Models:", mongoose.modelNames());
  })
  .catch((err) => console.log("❌ DB Error:", err));

// 3. Models Import
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

    if (query && query !== 'undefined' && query !== '') {
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

// C. Admin Route: Add New Product (NEW 🚀)
app.post('/products/add', async (req, res) => {
  try {
    const { name, price, storeName, distance, category, image } = req.body;

    const newProduct = new Product({
      name,
      price,
      storeName,
      distance: distance || "1.0 km", // Default distance if not provided
      category: category || "Grocery",
      image: image || "https://via.placeholder.com/150"
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, message: "Product added!", product: savedProduct });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ success: false, message: "Product add nahi hua!", error: error.message });
  }
});

// D. Admin Route: Delete Product (NEW 🚀)
app.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed", error: error.message });
  }
});

// 4. Server Listen
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});