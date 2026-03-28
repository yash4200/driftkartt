const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Taaki aap .env file use kar saken

const app = express();

// --- 🛠️ MIDDLEWARES ---
app.use(express.json());
app.use(cors({ origin: "*" })); // Live frontend ko allow karne ke liye

// --- 🌐 DATABASE CONNECTION ---
// Yahan apna MongoDB Atlas wala link dalo (Agar .env use kar rahe ho toh process.env.MONGO_URI)
const MONGO_URI = "mongodb+srv://yash:<password>@cluster0.mongodb.net/driftkart";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ DriftKart Database Connected (Cloud)!"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// --- 📦 SCHEMAS & MODELS ---

// 1. Product Schema (With Shop Name & Original Price)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },         // Discounted Price
  originalPrice: { type: Number },                // MRP (Strikethrough)
  category: { type: String, required: true },
  image: { type: String },
  shopName: { type: String, default: "Local Store" },
  stock: { type: Number, default: 10 }
});

const Product = mongoose.model('Product', productSchema);

// 2. Order Schema (For Admin Panel)
const orderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  address: Object,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// --- 🎯 API ROUTES ---

// Health Check (To see if server is alive)
app.get('/', (req, res) => {
  res.send("<h1>DriftKart Backend is Live! 🚀</h1>");
});

// GET: All Products (For Home Page)
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST: Add New Product (From Admin Panel)
app.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: "Error adding product" });
  }
});

// PUT: Update Product (For Admin Edit)
app.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});

// DELETE: Remove Product
app.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
});

// GET: All Orders (For Admin View)
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST: Place New Order (From Checkout Page)
app.post('/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: "Order placement failed" });
  }
});

// --- 🚀 SERVER START ---
const PORT = process.env.PORT || 10000; // Render uses process.env.PORT
app.listen(PORT, () => {
  console.log(`\n--------------------------------------`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📦 DriftKart API is ready for orders!`);
  console.log(`--------------------------------------\n`);
});