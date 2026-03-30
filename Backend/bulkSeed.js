const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://driftkartt:Yash12345@driftkart.okfymoi.mongodb.net/driftkart?retryWrites=true&w=majority&appName=driftkart";

mongoose.connect(MONGO_URI)
    .then(() => console.log("📡 Connected to Cloud DB (Marketplace Mode)..."))
    .catch(err => console.error("❌ Connection Error:", err));

// --- MODELS ---
const Shop = mongoose.model('Shop', new mongoose.Schema({
    name: String, image: String, category: String, rating: Number, address: String, location: Object, deliveryTime: String
}));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, brand: String, price: Number, originalPrice: Number, category: String, image: String, shopId: mongoose.Schema.Types.ObjectId, shopName: String, stock: Number
}));

// 🚩 Step 1: Base Shops (Zomato Style Brands)
const baseShops = [
    { name: "Gupta General Store", cat: "Grocery & Snacks", rate: 4.5, img: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png" },
    { name: "Sharma All In One", cat: "Supermarket", rate: 4.2, img: "https://cdn-icons-png.flaticon.com/512/606/606547.png" },
    { name: "Verma Book Depot", cat: "Stationery", rate: 4.0, img: "https://cdn-icons-png.flaticon.com/512/2232/2232688.png" },
    { name: "Wellness Medical", cat: "Pharmacy & Beauty", rate: 4.8, img: "https://cdn-icons-png.flaticon.com/512/3063/3063176.png" },
    { name: "Quick Mart", cat: "Daily Needs", rate: 3.9, img: "https://cdn-icons-png.flaticon.com/512/3711/3711310.png" }
];

// 🚩 Step 2: Base Templates (Daily Items)
const templates = [
    { name: "Aashirvaad Atta", brand: "Aashirvaad", basePrice: 240, baseOp: 290, category: "Grocery", img: "https://m.media-amazon.com/images/I/718Vv7u9PPL._SL1500_.jpg" },
    { name: "Fortune Oil", brand: "Fortune", basePrice: 110, baseOp: 160, category: "Grocery", img: "https://m.media-amazon.com/images/I/61S19S00R8L._SL1000_.jpg" },
    { name: "Maggi Noodles", brand: "Maggi", basePrice: 14, baseOp: 15, category: "Snacks", img: "https://m.media-amazon.com/images/I/81Uv5vVv8tL._SL1500_.jpg" },
    { name: "Classmate Notebook", brand: "Classmate", basePrice: 50, baseOp: 75, category: "Stationery", img: "https://m.media-amazon.com/images/I/61y88y10A9L._SL1500_.jpg" },
    { name: "Dove Soap", brand: "Dove", basePrice: 50, baseOp: 65, category: "Beauty", img: "https://m.media-amazon.com/images/I/51rI9S00R8L._SL1000_.jpg" },
    { name: "Coca Cola", brand: "Coke", basePrice: 35, baseOp: 45, category: "Drinks", img: "https://m.media-amazon.com/images/I/71K-K+X+XTL._SL1500_.jpg" }
];

const seed = async () => {
    try {
        await Shop.deleteMany({});
        await Product.deleteMany({});

        // 🏢 Shops Insert Karo
        const createdShops = await Shop.insertMany(baseShops.map(s => ({
            ...s,
            address: "Local Market, Bhubaneswar",
            location: { lat: 20.29, lng: 85.82 },
            deliveryTime: "20-30 min"
        })));
        console.log("✅ Shops Created!");

        // 📦 Bulk Products generate karo with Comparison Logic
        let bulkProducts = [];

        templates.forEach((t) => {
            // Har product ko kam se kam 3-4 shops mein daalo alag price pe
            createdShops.forEach((shop, index) => {
                // Algorithm: Price har shop pe +/- 5 rupees hoga comparison ke liye
                const priceVariation = Math.floor(Math.random() * 10) - 5;

                for (let i = 1; i <= 5; i++) { // 5 variants per product per shop
                    bulkProducts.push({
                        name: `${t.name} (Pack ${i})`,
                        brand: t.brand,
                        price: t.basePrice + priceVariation + (i * 2),
                        originalPrice: t.baseOp + (i * 3),
                        category: t.category,
                        image: t.img,
                        shopId: shop._id,
                        shopName: shop.name,
                        stock: 50 + i
                    });
                }
            });
        });

        await Product.insertMany(bulkProducts);
        console.log(`✅ Success! ${bulkProducts.length} Comparison Products Loaded!`);

    } catch (err) {
        console.error("❌ Seeding Failed:", err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seed();