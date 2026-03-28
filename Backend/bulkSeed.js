const mongoose = require('mongoose');

// 🚩 CHANGE: Local host ki jagah Atlas ka URI dala hai
const MONGO_URI = "mongodb+srv://driftkartt:Yash12345@driftkart.okfymoi.mongodb.net/driftkart?retryWrites=true&w=majority&appName=driftkart";

mongoose.connect(MONGO_URI)
    .then(() => console.log("📡 Connected to Cloud DB for Seeding..."))
    .catch(err => console.error("❌ Connection Error:", err));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, price: Number, originalPrice: Number, category: String, image: String, shopName: String, stock: Number
}));

const products = [
    { name: "Classmate Notebook A4", price: 55, originalPrice: 70, category: "Stationery", shopName: "Verma Book Depot", image: "https://m.media-amazon.com/images/I/61y88y10A9L._SL1500_.jpg", stock: 100 },
    { name: "Parker Vector Pen", price: 210, originalPrice: 250, category: "Stationery", shopName: "Verma Book Depot", image: "https://m.media-amazon.com/images/I/51v8nyS1URL._SL1500_.jpg", stock: 20 },
    { name: "Natraj Pencil Box", price: 42, originalPrice: 50, category: "Stationery", shopName: "Verma Book Depot", image: "https://m.media-amazon.com/images/I/71vunGshW8L._SL1500_.jpg", stock: 50 },
    { name: "Fortune Soyabean Oil 1L", price: 118, originalPrice: 145, category: "Grocery", shopName: "Sharma All In One Store", image: "https://m.media-amazon.com/images/I/61S19S00R8L._SL1000_.jpg", stock: 40 },
    { name: "Aashirvaad Atta 5kg", price: 248, originalPrice: 285, category: "Grocery", shopName: "Sharma All In One Store", image: "https://m.media-amazon.com/images/I/718Vv7u9PPL._SL1500_.jpg", stock: 15 },
    { name: "Tata Salt 1kg", price: 27, originalPrice: 28, category: "Grocery", shopName: "Sharma All In One Store", image: "https://m.media-amazon.com/images/I/61K-K+X+XTL._SL1500_.jpg", stock: 200 },
    { name: "Maggi 2-Min Noodles", price: 14, originalPrice: 15, category: "Daily Needs", shopName: "Gupta General Store", image: "https://m.media-amazon.com/images/I/81Uv5vVv8tL._SL1500_.jpg", stock: 300 },
    { name: "Coca Cola 750ml", price: 40, originalPrice: 45, category: "Daily Needs", shopName: "Gupta General Store", image: "https://m.media-amazon.com/images/I/51v8nyS1URL._SL1500_.jpg", stock: 45 },
    { name: "Dove Soap 100g", price: 55, originalPrice: 62, category: "Daily Needs", shopName: "Gupta General Store", image: "https://m.media-amazon.com/images/I/51rI9S00R8L._SL1000_.jpg", stock: 60 }
];

const seed = async () => {
    try {
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log("✅ DriftKart Cloud Inventory Updated!");
    } catch (err) {
        console.error("❌ Seeding Failed:", err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seed();