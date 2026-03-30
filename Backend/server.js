const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const connectDB = require("./db");
const Product = require("./models/Product");

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// ✅ Auth Middleware
const { protect } = require("./middleware/auth");
const { admin } = require("./middleware/adminMiddleware");
const { shopkeeper } = require("./middleware/shopkeeperMiddleware");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// Global Logger
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ Connect MongoDB
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", protect, admin, adminRoutes);
app.use("/api/shop", protect, shopkeeper, shopRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/user", userRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// Note: Removed the old test app.get("/products") since it's now handled by productRoutes



// ✅ Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});