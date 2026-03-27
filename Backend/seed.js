const mongoose = require('mongoose');
const Product = require('./models/Product');

// Final Connection String
const MONGO_URI = "mongodb+srv://driftkartt:Yash12345@driftkart.okfymoi.mongodb.net/driftkart?retryWrites=true&w=majority&appName=driftkart";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("🚀 Database Connected! Cleaning old data...");

        // Purana data saaf karo
        await Product.deleteMany({});

        const products = [];
        const names = ["Milk", "Bread", "Eggs", "Butter", "Cheese", "Coke", "Chips", "Apple", "Banana", "Rice", "Atta", "Dal", "Soap"];
        const stores = ["Reliance Fresh", "Big Bazaar", "Apna Store", "Zomato Mart", "Quick Mart"];

        console.log("📦 Generating 100 products...");

        for (let i = 1; i <= 100; i++) {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomStore = stores[Math.floor(Math.random() * stores.length)];
            const randomDist = (Math.random() * 4 + 0.5).toFixed(1); // 0.5km se 4.5km

            products.push({
                name: `${randomName} - Fresh Pack ${i}`,
                price: Math.floor(Math.random() * 450) + 15,
                storeName: randomStore,
                distance: `${randomDist} km`,
                category: "Grocery",
                image: "https://via.placeholder.com/150"
            });
        }

        await Product.insertMany(products);
        console.log("✅ 100 Products Added Successfully to MongoDB Atlas!");
        process.exit();
    })
    .catch(err => {
        console.error("❌ Connection Error:", err);
        process.exit(1);
    });