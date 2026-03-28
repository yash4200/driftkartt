const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 🛠️ MIDDLEWARES ---
app.use(express.json());
app.use(cors({ origin: "*" }));

// --- 🌐 DATABASE CONNECTION (Fixed with your ID & Password) ---
const MONGO_URI = "mongodb+srv://driftkartt:Yash12345@driftkart.okfymoi.mongodb.net/driftkart?retryWrites=true&w=majority&appName=driftkart";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("\n--------------------------------------");
    console.log("✅ DriftKart Cloud Database Connected!");
    console.log("📂 Database: driftkart");
    console.log("--------------------------------------\n");
  })
  .catch(err => {
    console.log("❌ DB Connection Error!");
    console.error("Error Message:", err.message);
    console.log("\n💡 Last Check: Go to MongoDB Atlas -> Network Access -> Add IP -> Select 'Allow Access From Anywhere' (0.0.0.0/0)");
  });

// --- 📦 SCHEMAS & MODELS ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  image: { type: String, default: "https://via.placeholder.com/150" },
  shopName: { type: String, default: "Local Store" },
  stock: { type: Number, default: 10 }
});
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  address: Object,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// --- 🎯 API ROUTES ---
app.get('/', (req, res) => {
  res.send("<h1 style='text-align:center; font-family:sans-serif; color:#2ecc71;'>🚀 DriftKart Backend is LIVE!</h1>");
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: "Add failed" });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: "Order failed" });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Orders fetch failed" });
  }
});

// --- 🚀 SERVER START ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`📡 Server running on Port: ${PORT}`);
  console.log(`🏪 DriftKart is Ready to Take Orders!`);
});