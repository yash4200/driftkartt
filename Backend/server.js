const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const products = [
  { name: "Milk", price: 50, shop: "Shop A" },
  { name: "Milk", price: 45, shop: "Shop B" },
  { name: "Milk", price: 48, shop: "Shop C" },
  { name: "Bread", price: 30, shop: "Shop D" },
  { name: "Eggs", price: 60, shop: "Shop E" }
];

app.get("/products", (req, res) => {
  const query = req.query.query?.toLowerCase();

  const filtered = query
    ? products.filter(p =>
        p.name.toLowerCase().includes(query)
      )
    : products;

  res.json(filtered);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});