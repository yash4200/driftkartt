const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true }, // Jaise: Amul, Ashirvaad, Maggi
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // Jaise: Dairy, Grocery, Snacks
    image: { type: String },

    // 🚩 MARKETPLACE LOGIC: Shop Linkage
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopName: { type: String, required: true }, // Direct display ke liye

    // 📍 LOCATION LOGIC: Near me filter ke liye
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },

    unit: { type: String, default: "1 Unit" }, // Jaise: 1kg, 500ml
    isBestDeal: { type: Boolean, default: false }, // Algorithm se set hoga
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);