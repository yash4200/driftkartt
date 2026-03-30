const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://driftkartt:Yash12345@driftkart.okfymoi.mongodb.net/driftkart?retryWrites=true&w=majority&appName=driftkart";

mongoose.connect(MONGO_URI)
    .then(() => console.log("📡 Connected to Cloud DB for Seeding..."))
    .catch(err => console.error("❌ Connection Error:", err));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, price: Number, originalPrice: Number, category: String, image: String, shopName: String, stock: Number
}));

const products = [
    // --- STATIONERY (From School to Business) ---
    { name: "Classmate Notebook A4", price: 55, originalPrice: 70, category: "Stationery", shopName: "Verma Book Depot", image: "https://m.media-amazon.com/images/I/61y88y10A9L._SL1500_.jpg", stock: 100 },
    { name: "Parker Vector Pen", price: 210, originalPrice: 250, category: "Stationery", shopName: "Verma Book Depot", image: "https://m.media-amazon.com/images/I/51v8nyS1URL._SL1500_.jpg", stock: 20 },

    // --- GROCERY & KITCHEN ---
    { name: "Fortune Soyabean Oil 1L", price: 118, originalPrice: 145, category: "Grocery", shopName: "Sharma All In One Store", image: "https://m.media-amazon.com/images/I/61S19S00R8L._SL1000_.jpg", stock: 40 },
    { name: "Aashirvaad Atta 5kg", price: 248, originalPrice: 285, category: "Grocery", shopName: "Sharma All In One Store", image: "https://m.media-amazon.com/images/I/718Vv7u9PPL._SL1500_.jpg", stock: 15 },

    // --- SNACKS & DRINKS ---
    { name: "Maggi 2-Min Noodles", price: 14, originalPrice: 15, category: "Snacks", shopName: "Gupta General Store", image: "https://m.media-amazon.com/images/I/81Uv5vVv8tL._SL1500_.jpg", stock: 300 },
    { name: "Coca Cola 750ml", price: 40, originalPrice: 45, category: "Drinks", shopName: "Gupta General Store", image: "https://m.media-amazon.com/images/I/71K-K+X+XTL._SL1500_.jpg", stock: 45 },

    // --- BEAUTY & PERSONAL CARE ---
    { name: "Dove Soap 100g", price: 55, originalPrice: 62, category: "Beauty", shopName: "Wellness Medical", image: "https://m.media-amazon.com/images/I/51rI9S00R8L._SL1000_.jpg", stock: 60 },
    { name: "Nivea Soft Cream", price: 180, originalPrice: 210, category: "Beauty", shopName: "Wellness Medical", image: "https://m.media-amazon.com/images/I/61Z7Z7f-pRL._SL1500_.jpg", stock: 30 },

    // --- PURE & ORGANIC ---
    { name: "Dabur Honey 500g", price: 199, originalPrice: 220, category: "Organic", shopName: "Natural Organic Hub", image: "https://m.media-amazon.com/images/I/71S-S+X+XTL._SL1500_.jpg", stock: 25 },

    // --- COOL OFF FROZEN DESSERT ---
    { name: "Amul Vanilla Ice Cream", price: 150, originalPrice: 165, category: "Frozen", shopName: "Cold Point", image: "https://m.media-amazon.com/images/I/61S19S00R8L._SL1000_.jpg", stock: 12 },

    // --- SNEAKERHEADS & SHOE LOVERS ---
    { name: "Nike Air Max MockUP", price: 2499, originalPrice: 3999, category: "Shoes", shopName: "Step Up Footwear", image: "https://m.media-amazon.com/images/I/71vunGshW8L._SL1500_.jpg", stock: 5 },

    // --- SWEET MUNCHING ---
    { name: "Dairy Milk Silk", price: 75, originalPrice: 80, category: "Sweets", shopName: "Sweet Treats", image: "https://m.media-amazon.com/images/I/61K-K+X+XTL._SL1500_.jpg", stock: 100 }
];

const seed = async () => {
    try {
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log("✅ DriftKart Cloud Inventory Fully Updated with Sections!");
    } catch (err) {
        console.error("❌ Seeding Failed:", err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seed();