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
    { name: "Gupta General Store", cat: "Grocery & Snacks", rate: 4.5, img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQZvAyX3TDqNDRS1DmgPvZ2qmWm1Ak323Y6XzsqbAuHiPoZ48in9aiiQholZ3HvM4DlaiwgqY1_Ma5n7IUA0zmXb7_N1djB" },
    { name: "Sharma All In One", cat: "Supermarket", rate: 4.2, img: "https://content.jdmagicbox.com/comp/jaipur/i5/0141px141.x141.171003044553.m6i5/catalogue/sharma-store-jaipur-1hsownvigd.jpg" },
    { name: "Verma Book Depot", cat: "Stationery", rate: 4.0, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3JLgFhQ9ykUGuIvaoPichzasjBRsqJCNhAQ&s" },
    { name: "Wellness Medical", cat: "Pharmacy & Beauty", rate: 4.8, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkvb5PcQXdzhORTWo7XzHYMwsICAzuS8dlhg&s" },
    { name: "Quick Mart", cat: "Daily Needs", rate: 3.9, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRByayLF8QsReJ0ByT-_Lukt2-UrXx7OJzXg&s" }
];

// 🚩 Step 2: Base Templates with Realistic Variants
const templates = [
    { name: "Aashirvaad Atta", brand: "Aashirvaad", basePrice: 240, baseOp: 290, category: "Grocery", img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQZomAFNN8jndISl8jUWMXxVWsRZ3seXOdDMYeG7fejYrSJxTUE0l6aBB7aUjx6TZmiryLnaDouWck9NmNtPXeoSrhqp8vUZjMkgPa7nfRUkAy9FrcC3UqY", variants: ["1kg", "5kg Economy", "10kg", "Multigrain", "Sharbati"] },
    { name: "Fortune Oil", brand: "Fortune", basePrice: 110, baseOp: 160, category: "Grocery", img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQfkrVAqB3R4oveJ-TTENlZtwLEJnjOUDuzrbZZQxnHfrgucU6YaoWEFcjVOYgfy9Yxi5cFOUNa0x-Gjged7Cdx19df1fpXXfVwZWSxm1AfCPG7HGAe0fAJlzg", variants: ["1L Pouch", "1L Bottle", "5L Jar", "Kachi Ghani", "Refined"] },
    { name: "Maggi Noodles", brand: "Maggi", basePrice: 14, baseOp: 15, category: "Snacks", img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSt8dMLiAPOeCi_WgoL9ts4emlvTI_B36kokcaUw8Qq6oaGwcUKrgoZbD8fThFbJXr8JHP71Aw2-YAQqJH546p9bM4OuNAXcA", variants: ["Masala 70g", "Atta Noodles", "Special Masala", "12-Pack Family", "Oats Noodles"] },
    { name: "Classmate Notebook", brand: "Classmate", basePrice: 50, baseOp: 75, category: "Stationery", img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQQucIA-wNypMTcfgklmgIVbMNeLkAbihyVSE1Q7p_Yj9CN8GmQmX8a61z_3iMh9heZ042IVnl__AamEqfSJ8_LXWT2lB1j_0xvxcvm9dVmWcInxGvjZzmBfQ", variants: ["Spiral Bound", "Single Line", "Unruled", "A4 Size", "Practical File"] },
    { name: "Dove Soap", brand: "Dove", basePrice: 50, baseOp: 65, category: "Beauty", img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTYASEDAhZtq-CzVB-fldP6o23rG9RtDYocl6X1i_lR772JcVwb26KuXlcgyyZraoUp5UrEuCxX5ctnMBLmx1nk_Z-OP7nk2cazKaWyilmDWPeqa7tdvXNx0Nqs", variants: ["Cream Bar", "Sensitive", "Fresh Touch", "Pink Rosa", "Travel Pack"] },
    { name: "Coca Cola", brand: "Coke", basePrice: 35, baseOp: 45, category: "Drinks", img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTib0fQ31yzglF2Igh51qPqrstRCLMFQwRVXysw1q3UI6vPyVcJMfIoYaChGwxnC75Z6bS6yUZ2NTkhT_5eMLjaWwsK7W_EesOWlvkXr2bN2dvA9dka1gpJfQ", variants: ["250ml Can", "500ml Pet", "1.25L Bottle", "Diet Coke", "Zero Sugar"] }
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