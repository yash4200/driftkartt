const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://driftkartt:Yash12345@driftkart.okfymoi.mongodb.net/driftkart?retryWrites=true&w=majority&appName=driftkart";

mongoose.connect(MONGO_URI)
    .then(() => console.log("📡 Connected to Cloud DB..."))
    .catch(err => console.error("❌ Connection Error:", err));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, price: Number, originalPrice: Number, category: String, image: String, shopName: String, stock: Number
}));

const baseProducts = [
    { name: "Aashirvaad Atta", price: 245, op: 280, cat: "Grocery", shop: "Sharma All In One", img: "https://m.media-amazon.com/images/I/718Vv7u9PPL._SL1500_.jpg", variants: ["1kg Pack", "5kg Economy", "10kg Family Pack", "Multigrain 5kg", "Select Sharbati 5kg"] },
    { name: "Fortune Oil", price: 115, op: 150, cat: "Grocery", shop: "Sharma All In One", img: "https://m.media-amazon.com/images/I/61S19S00R8L._SL1000_.jpg", variants: ["1L Pouch", "1L Bottle", "5L Jar", "Rice Bran 1L", "Soya Health 1L"] },
    { name: "Maggi Noodles", price: 14, op: 15, cat: "Snacks", shop: "Gupta General Store", img: "https://m.media-amazon.com/images/I/81Uv5vVv8tL._SL1500_.jpg", variants: ["Masala 70g", "Special Masala", "Atta Noodles", "Oats Noodles", "Korean Spicy", "Family Pack (12 units)"] },
    { name: "Classmate Notebook", price: 55, op: 70, cat: "Stationery", shop: "Verma Book Depot", img: "https://m.media-amazon.com/images/I/61y88y10A9L._SL1500_.jpg", variants: ["Single Line 172pg", "Spiral Bound", "Unruled 120pg", "Hardcover Diary", "A4 Size 240pg"] },
    { name: "Dove Shampoo", price: 180, op: 220, cat: "Beauty", shop: "Wellness Medical", img: "https://m.media-amazon.com/images/I/51rI9S00R8L._SL1000_.jpg", variants: ["Hair Fall Rescue", "Daily Shine", "Intense Repair", "Dandruff Care", "180ml Bottle", "650ml Pump"] },
    { name: "Coca Cola", price: 40, op: 45, cat: "Drinks", shop: "Gupta General Store", img: "https://m.media-amazon.com/images/I/71K-K+X+XTL._SL1500_.jpg", variants: ["250ml Can", "500ml Bottle", "1.25L Party Pack", "Diet Coke", "Zero Sugar"] },
    { name: "Nike Sneaker", price: 2999, op: 4500, cat: "Shoes", shop: "Step Up Footwear", img: "https://m.media-amazon.com/images/I/71vunGshW8L._SL1500_.jpg", variants: ["Black - Size 7", "White - Size 8", "Red - Size 9", "Running Edition", "Air Max Style"] }
];

const generateProducts = () => {
    let finalItems = [];
    baseProducts.forEach((item) => {
        // 🚩 Har product ke liye uske variants list se generate karna
        item.variants.forEach((vName, i) => {
            finalItems.push({
                name: `${item.name} (${vName})`,
                price: item.price + (i * 15), // Thoda realistic price gap
                originalPrice: item.op + (i * 20),
                category: item.cat,
                shopName: item.shop,
                image: item.img,
                stock: 50 + (i * 5)
            });
        });

        // Agar 30 items pure nahi hue, toh random variants add karna
        for (let j = item.variants.length + 1; j <= 30; j++) {
            finalItems.push({
                name: `${item.name} - Bulk Pack ${j}`,
                price: item.price + (j * 10),
                originalPrice: item.op + (j * 12),
                category: item.cat,
                shopName: item.shop,
                image: item.img,
                stock: 100 + j
            });
        }
    });
    return finalItems;
};

const seed = async () => {
    try {
        const allProducts = generateProducts();
        await Product.deleteMany({});
        console.log("🧹 Old products cleared...");
        await Product.insertMany(allProducts);
        console.log(`✅ ${allProducts.length} Realistic Products Loaded Successfully!`);
    } catch (err) {
        console.error("❌ Seeding Failed:", err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seed();