const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://driftkartt:Yash12345@driftkart.okfymoi.mongodb.net/driftkart?retryWrites=true&w=majority&appName=driftkart";

mongoose.connect(MONGO_URI)
    .then(() => console.log("📡 Connected to Cloud DB..."))
    .catch(err => console.error("❌ Connection Error:", err));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, price: Number, originalPrice: Number, category: String, image: String, shopName: String, stock: Number
}));

// 🚩 Base templates for generating 200+ items
const templates = [
    { name: "Aashirvaad Atta", basePrice: 240, baseOp: 290, category: "Grocery", shop: "Sharma All In One Store", img: "https://m.media-amazon.com/images/I/718Vv7u9PPL._SL1500_.jpg" },
    { name: "Fortune Oil", basePrice: 110, baseOp: 160, category: "Grocery", shop: "Sharma All In One Store", img: "https://m.media-amazon.com/images/I/61S19S00R8L._SL1000_.jpg" },
    { name: "Maggi Noodles", basePrice: 14, baseOp: 15, category: "Snacks", shop: "Gupta General Store", img: "https://m.media-amazon.com/images/I/81Uv5vVv8tL._SL1500_.jpg" },
    { name: "Classmate Notebook", basePrice: 50, baseOp: 75, category: "Stationery", shop: "Verma Book Depot", img: "https://m.media-amazon.com/images/I/61y88y10A9L._SL1500_.jpg" },
    { name: "Dove Soap", basePrice: 50, baseOp: 65, category: "Beauty", shop: "Wellness Medical", img: "https://m.media-amazon.com/images/I/51rI9S00R8L._SL1000_.jpg" },
    { name: "Coca Cola", basePrice: 35, baseOp: 45, category: "Drinks", shop: "Gupta General Store", img: "https://m.media-amazon.com/images/I/71K-K+X+XTL._SL1500_.jpg" },
    { name: "Nike Sneaker", basePrice: 1999, baseOp: 3999, category: "Shoes", shop: "Step Up Footwear", img: "https://m.media-amazon.com/images/I/71vunGshW8L._SL1500_.jpg" },
    { name: "Dairy Milk", basePrice: 40, baseOp: 50, category: "Sweets", shop: "Sweet Treats", img: "https://m.media-amazon.com/images/I/61K-K+X+XTL._SL1500_.jpg" }
];

const generateBulkProducts = () => {
    let bulkData = [];
    const variants = ["Small Pack", "Family Pack", "Value Combo", "Budget Pack", "Premium Edition", "Refill Pack"];

    // 🚩 Loop to create 200+ entries
    templates.forEach((t) => {
        for (let i = 1; i <= 26; i++) { // 8 templates * 26 variants = ~208 products
            const randomSuffix = variants[i % variants.length];
            bulkData.push({
                name: `${t.name} (${randomSuffix} #${i})`,
                price: t.basePrice + (i * 2), // Price variant
                originalPrice: t.baseOp + (i * 3), // Higher OP for discount calculation
                category: t.category,
                shopName: t.shop,
                image: t.img,
                stock: 50 + i
            });
        }
    });
    return bulkData;
};

const seed = async () => {
    try {
        const productsToInsert = generateBulkProducts();
        await Product.deleteMany({});
        await Product.insertMany(productsToInsert);
        console.log(`✅ Success! ${productsToInsert.length} products loaded into DriftKart!`);
    } catch (err) {
        console.error("❌ Seeding Failed:", err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seed();