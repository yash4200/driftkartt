const mongoose = require('mongoose');

// 🚩 FIX: Localhost ki jagah Atlas ka URI use karo taaki Render pe chale
const MONGO_URI = "mongodb+srv://driftkartt:Yash12345@driftkart.okfymoi.mongodb.net/driftkart?retryWrites=true&w=majority&appName=driftkart";

mongoose.connect(MONGO_URI)
    .then(() => console.log("📡 Connected to Cloud DB for Seeding..."))
    .catch(err => console.error("❌ Connection Error:", err));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    price: Number,
    originalPrice: Number,
    category: String,
    image: String,
    shopName: String,
    stock: Number
}));

const products = [
    // --- GROCERY & KITCHEN (Sharma All In One Store) ---
    { name: "Aashirvaad Atta 5kg", price: 245, originalPrice: 280, category: "Grocery", shopName: "Sharma All In One Store", image: "https://m.media-amazon.com/images/I/718Vv7u9PPL._SL1500_.jpg", stock: 20 },
    { name: "Fortune Soyabean Oil 1L", price: 118, originalPrice: 145, category: "Grocery", shopName: "Sharma All In One Store", image: "https://m.media-amazon.com/images/I/61S19S00R8L._SL1000_.jpg", stock: 40 },

    // --- SNACKS & DRINKS ---
    { name: "Maggi 2-Min Noodles (Pack of 12)", price: 160, originalPrice: 168, category: "Snacks", shopName: "Gupta General Store", image: "https://m.media-amazon.com/images/I/81Uv5vVv8tL._SL1500_.jpg", stock: 50 },
    { name: "Coca Cola 750ml", price: 40, originalPrice: 45, category: "Drinks", shopName: "Gupta General Store", image: "https://m.media-amazon.com/images/I/71K-K+X+XTL._SL1500_.jpg", stock: 45 },

    // --- STATIONERY (From School to Business) ---
    { name: "Classmate Notebooks (Pack of 6)", price: 320, originalPrice: 360, category: "Stationery", shopName: "Verma Book Depot", image: "https://m.media-amazon.com/images/I/61y88y10A9L._SL1500_.jpg", stock: 15 },
    { name: "Parker Vector Pen", price: 210, originalPrice: 250, category: "Stationery", shopName: "Verma Book Depot", image: "https://m.media-amazon.com/images/I/51v8nyS1URL._SL1500_.jpg", stock: 20 },

    // --- BEAUTY & PERSONAL CARE ---
    { name: "Dove Shampoo 650ml", price: 450, originalPrice: 525, category: "Beauty", shopName: "Wellness Medical", image: "https://m.media-amazon.com/images/I/51rI9S00R8L._SL1000_.jpg", stock: 12 },
    { name: "Nivea Soft Cream", price: 180, originalPrice: 210, category: "Beauty", shopName: "Wellness Medical", image: "https://m.media-amazon.com/images/I/61Z7Z7f-pRL._SL1500_.jpg", stock: 30 },

    // --- PURE AND ORGANIC ---
    { name: "Dabur Honey 500g", price: 199, originalPrice: 220, category: "Organic", shopName: "Natural Organic Hub", image: "https://m.media-amazon.com/images/I/71S-S+X+XTL._SL1500_.jpg", stock: 25 },

    // --- COOL OFF FROZEN DESSERT ---
    { name: "Amul Vanilla Ice Cream", price: 150, originalPrice: 165, category: "Frozen", shopName: "Cold Point", image: "https://m.media-amazon.com/images/I/61S19S00R8L._SL1000_.jpg", stock: 12 },

    // --- SNEAKERHEADS & SHOE-LOVERS ---
    { name: "Nike Air Max MockUP", price: 2499, originalPrice: 3999, category: "Shoes", shopName: "Step Up Footwear", image: "https://m.media-amazon.com/images/I/71vunGshW8L._SL1500_.jpg", stock: 5 }
];

const seed = async () => {
    try {
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log("✅ DriftKart Inventory Updated for All Sections!");
    } catch (err) {
        console.error("❌ Seeding Failed:", err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seed();