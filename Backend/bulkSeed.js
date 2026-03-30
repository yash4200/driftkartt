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

// 🚩 Step 1: Base Shops
const baseShops = [
    { name: "Gupta General Store", cat: "Grocery & Snacks", rate: 4.5, img: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png" },
    { name: "Sharma All In One", cat: "Supermarket", rate: 4.2, img: "https://cdn-icons-png.flaticon.com/512/606/606547.png" },
    { name: "Verma Book Depot", cat: "Stationery", rate: 4.0, img: "https://cdn-icons-png.flaticon.com/512/2232/2232688.png" },
    { name: "Wellness Medical", cat: "Pharmacy & Beauty", rate: 4.8, img: "https://cdn-icons-png.flaticon.com/512/3063/3063176.png" },
    { name: "Quick Mart", cat: "Daily Needs", rate: 3.9, img: "https://cdn-icons-png.flaticon.com/512/3711/3711310.png" }
];

// 🚩 Step 2: Base Templates with Realistic Variants
const templates = [
    { name: "Aashirvaad Atta", brand: "Aashirvaad", basePrice: 240, baseOp: 290, category: "Grocery", img: "https://m.media-amazon.com/images/I/718Vv7u9PPL._SL1500_.jpg", variants: ["1kg", "5kg Economy", "10kg", "Multigrain", "Sharbati"] },
    { name: "Fortune Oil", brand: "Fortune", basePrice: 110, baseOp: 160, category: "Grocery", img: "https://m.media-amazon.com/images/I/61S19S00R8L._SL1000_.jpg", variants: ["1L Pouch", "1L Bottle", "5L Jar", "Kachi Ghani", "Refined"] },
    { name: "Maggi Noodles", brand: "Maggi", basePrice: 14, baseOp: 15, category: "Snacks", img: "https://m.media-amazon.com/images/I/81Uv5vVv8tL._SL1500_.jpg", variants: ["Masala 70g", "Atta Noodles", "Special Masala", "12-Pack Family", "Oats Noodles"] },
    { name: "Classmate Notebook", brand: "Classmate", basePrice: 50, baseOp: 75, category: "Stationery", img: "https://m.media-amazon.com/images/I/61y88y10A9L._SL1500_.jpg", variants: ["Spiral Bound", "Single Line", "Unruled", "A4 Size", "Practical File"] },
    { name: "Dove Soap", brand: "Dove", basePrice: 50, baseOp: 65, category: "Beauty", img: "https://m.media-amazon.com/images/I/51rI9S00R8L._SL1000_.jpg", variants: ["Cream Bar", "Sensitive", "Fresh Touch", "Pink Rosa", "Travel Pack"] },
    { name: "Coca Cola", brand: "Coke", basePrice: 35, baseOp: 45, category: "Drinks", img: "https://m.media-amazon.com/images/I/71K-K+X+XTL._SL1500_.jpg", variants: ["250ml Can", "500ml Pet", "1.25L Bottle", "Diet Coke", "Zero Sugar"] }
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

        let bulkProducts = [];

        templates.forEach((t) => {
            // Har product ko sabhi relevant shops mein daalo (Comparison ke liye)
            createdShops.forEach((shop) => {

                // Logic: Srif wahi products shops mein daalo jo shop ki category se match karein
                // Magar diversity ke liye hum general stores mein sab kuch daal rahe hain
                const isStationeryShop = shop.name.includes("Book");
                const isPharmacy = shop.name.includes("Medical");

                t.variants.forEach((vName, i) => {
                    // Random price logic to show comparison in search
                    const priceVariation = Math.floor(Math.random() * 12) - 6; // +/- 6 rupees

                    bulkProducts.push({
                        name: `${t.name} (${vName})`,
                        brand: t.brand,
                        price: t.basePrice + priceVariation + (i * 10),
                        originalPrice: t.baseOp + (i * 15),
                        category: t.category,
                        image: t.img,
                        shopId: shop._id,
                        shopName: shop.name,
                        stock: 40 + (i * 5)
                    });
                });
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