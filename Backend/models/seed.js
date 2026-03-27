require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Database Connected for Seeding...");

        // Purane products delete karo pehle
        await Product.deleteMany({});

        const products = [];
        const names = ["Milk", "Bread", "Eggs", "Butter", "Cheese", "Coke", "Chips", "Apple", "Banana", "Rice"];
        const stores = ["Reliance Fresh", "Big Bazaar", "Local Kirana", "Zudio Food", "Quick Mart"];

        for (let i = 1; i <= 100; i++) {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomStore = stores[Math.floor(Math.random() * stores.length)];
            const randomDist = (Math.random() * 5 + 0.5).toFixed(1); // 0.5 se 5.5 km tak

            products.push({
                name: `${randomName} Pack #${i}`,
                price: Math.floor(Math.random() * 500) + 20,
                storeName: randomStore,
                distance: `${randomDist} km`,
                category: "Grocery",
                image: "https://via.placeholder.com/150"
            });
        }

        await Product.insertMany(products);
        console.log("✅ 100 Products Added Successfully!");
        process.exit();
    })
    .catch(err => console.log(err));