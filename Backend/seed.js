const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://driftkartt:Yash12345@driftkart.okfymoi.mongodb.net/driftkart?retryWrites=true&w=majority&appName=driftkart";

mongoose.connect(MONGO_URI)
    .then(() => console.log("📡 Connected to Cloud DB..."))
    .catch(err => console.error("❌ Connection Error:", err));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, price: Number, originalPrice: Number, category: String, image: String, shopName: String, stock: Number
}));

// Base products ka data
const baseProducts = [
    { name: "Aashirvaad Atta", price: 245, op: 280, cat: "Grocery", shop: "Sharma All In One", img: "https://m.media-amazon.com/images/I/718Vv7u9PPL._SL1500_.jpg" },
    { name: "Fortune Oil", price: 115, op: 150, cat: "Grocery", shop: "Sharma All In One", img: "https://m.media-amazon.com/images/I/61S19S00R8L._SL1000_.jpg" },
    { name: "Maggi Noodles", price: 14, op: 15, cat: "Snacks", shop: "Gupta General Store", img: "https://m.media-amazon.com/images/I/81Uv5vVv8tL._SL1500_.jpg" },
    { name: "Classmate Notebook", price: 55, op: 70, cat: "Stationery", shop: "Verma Book Depot", img: "https://m.media-amazon.com/images/I/61y88y10A9L._SL1500_.jpg" },
    { name: "Dove Shampoo", price: 180, op: 220, cat: "Beauty", shop: "Wellness Medical", img: "https://m.media-amazon.com/images/I/51rI9S00R8L._SL1000_.jpg" },
    { name: "Coca Cola", price: 40, op: 45, cat: "Drinks", shop: "Gupta General Store", img: "https://m.media-amazon.com/images/I/71K-K+X+XTL._SL1500_.jpg" },
    { name: "Nike Sneaker", price: 2999, op: 4500, cat: "Shoes", shop: "Step Up Footwear", img: "https://m.media-amazon.com/images/I/71vunGshW8L._SL1500_.jpg" }
];

const generateProducts = () => {
    let finalItems = [];
    // 🚩 Loop chala kar 210 products generate karna (30 variants per base product)
    baseProducts.forEach((item, index) => {
        for (let i = 1; i <= 30; i++) {
            finalItems.push({
                name: `${item.name} - Variant ${i}`,
                price: item.price + (i * 2), // Har variant ka price thoda alag
                originalPrice: item.op + (i * 3),
                category: item.cat,
                shopName: item.shop,
                image: item.img,
                stock: 100 + i
            });
        }
    });
    return finalItems;
};

const seed = async () => {
    try {
        const allProducts = generateProducts();
        await Product.deleteMany({});
        await Product.insertMany(allProducts);
        console.log(`✅ ${allProducts.length} Products Loaded Successfully!`);
    } catch (err) {
        console.error("❌ Seeding Failed:", err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seed();