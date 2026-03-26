const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dummy products
const products = [
  { name: "Milk", price: 50, shop: "Shop A" },
  { name: "Milk", price: 45, shop: "Shop B" },
  { name: "Milk", price: 48, shop: "Shop C" },
  { name: "Bread", price: 30, shop: "Shop D" },
  { name: "Eggs", price: 60, shop: "Shop E" }
];

// ✅ Home route (optional but useful)
app.get("/", (req, res) => {
  res.send("DriftKart Backend Running 🚀");
});

// ✅ Products API (search support)
app.get("/products", (req, res) => {
  const query = req.query.query?.toLowerCase();

  const filtered = query
    ? products.filter(p =>
        p.name.toLowerCase().includes(query)
      )
    : products;

  res.json(filtered);
});

// ✅ IMPORTANT (Render ke liye)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});