const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🚩 Middleware
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://driftkartt:Yash12345@driftkart.okfymoi.mongodb.net/driftkart?retryWrites=true&w=majority&appName=driftkart";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ DB Connected (Marketplace Mode)"))
  .catch(err => console.log("❌ DB Error:", err));

// --- 🏢 MODELS (Updated for Comparison) ---

// 1. Shop Model (For Zomato-style Local Brands)
const shopSchema = new mongoose.Schema({
  name: String,
  image: String,
  category: String,
  rating: { type: Number, default: 4.0 },
  address: String,
  location: { lat: Number, lng: Number },
  deliveryTime: { type: String, default: "20 min" },
  isOpen: { type: Boolean, default: true }
});
const Shop = mongoose.model('Shop', shopSchema);

// 2. Product Model (With Brand & Shop Linkage)
const productSchema = new mongoose.Schema({
  name: String,
  brand: String, // Jaise: Amul, Ashirvaad (For Comparison)
  price: Number,
  category: String,
  image: String,
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  shopName: String,
  unit: { type: String, default: "1 Unit" } // 1kg, 500ml etc.
});
const Product = mongoose.model('Product', productSchema);

// 3. Order Model (Vendor Specific)
const orderSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  items: Array,
  totalAmount: Number,
  customerName: String,
  customerPhone: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);


// --- 🚀 ROUTES (The Marketplace Engine) ---

// 🔍 SEARCH & COMPARE: The "Best Deal" Logic
app.get('/products/search', async (req, res) => {
  try {
    const { q } = req.query; // e.g. /products/search?q=milk
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } }
      ]
    }).sort({ price: 1 }); // 🚩 Lowest Price first (Best Deal)
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🏢 SHOPS: Get all local shops (For "Top Brands" UI)
app.get('/shops', async (req, res) => {
  const shops = await Shop.find().sort({ rating: -1 });
  res.json(shops);
});

// 🛒 PRODUCTS: General list
app.get('/products', async (req, res) => {
  const products = await Product.find().sort({ _id: -1 });
  res.json(products);
});

// 📦 ORDERS: Place new order
app.post('/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CRUD for Admin (Optional)
app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).json(newProduct);
});

app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// 🚩 Port Config for Render/Vercel
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Marketplace Server running on ${PORT}`));