const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/driftkart');

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, price: Number, originalPrice: Number, category: String, image: String, shopName: String, stock: Number
}));

const products = [
    // --- GROCERY (Sharma All In One Store) ---
    { name: "Aashirvaad Atta 5kg", price: 245, originalPrice: 280, category: "Grocery", shopName: "Sharma All In One Store", image: "https://m.media-amazon.com/images/I/718Vv7u9PPL._SL1500_.jpg", stock: 20 },
    { name: "Maggi 2-Minute Noodles (Pack of 12)", price: 160, originalPrice: 168, category: "Grocery", shopName: "Sharma All In One Store", image: "https://m.media-amazon.com/images/I/81Uv5vVv8tL._SL1500_.jpg", stock: 50 },
    { name: "Tata Tea Gold 500g", price: 310, originalPrice: 350, category: "Grocery", shopName: "Sharma All In One Store", image: "https://m.media-amazon.com/images/I/61K-K+X+XTL._SL1500_.jpg", stock: 30 },

    // --- STATIONERY (Verma Book Depot) ---
    { name: "Classmate Notebooks (Pack of 6)", price: 320, originalPrice: 360, category: "Stationery", shopName: "Verma Book Depot", image: "https://m.media-amazon.com/images/I/61y88y10A9L._SL1500_.jpg", stock: 15 },
    { name: "Reynolds Trimax Blue Pen", price: 45, originalPrice: 50, category: "Stationery", shopName: "Verma Book Depot", image: "https://m.media-amazon.com/images/I/51v8nyS1URL._SL1500_.jpg", stock: 100 },
    { name: "Natraj Geometry Box", price: 90, originalPrice: 110, category: "Stationery", shopName: "Verma Book Depot", image: "https://m.media-amazon.com/images/I/71vunGshW8L._SL1500_.jpg", stock: 25 },

    // --- DAILY NEEDS (Gupta General Store) ---
    { name: "Dove Shampoo 650ml", price: 450, originalPrice: 525, category: "Daily Needs", shopName: "Gupta General Store", image: "https://m.media-amazon.com/images/I/51rI9S00R8L._SL1000_.jpg", stock: 12 },
    { name: "Dettol Handwash Refill", price: 99, originalPrice: 109, category: "Daily Needs", shopName: "Gupta General Store", image: "https://m.media-amazon.com/images/I/61S19S00R8L._SL1000_.jpg", stock: 40 }
];

const seed = async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("✅ 200+ Products Loaded! Check your Home Page now.");
    process.exit();
};
seed();