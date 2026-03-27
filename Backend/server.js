const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const Product = require("./models/Product");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ GET products (search)
app.get("/products", async (req, res) => {
  const query = req.query.query?.toLowerCase();

  try {
    let products;

    if (query) {
      products = await Product.find({
        name: { $regex: query, $options: "i" }
      });
    } else {
      products = await Product.find();
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ ADD product (for testing)
app.post("/add-product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error saving product" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});