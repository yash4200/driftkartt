const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Jaise: Gupta General Store
    ownerName: { type: String },
    image: { type: String }, // Shop ki front photo
    category: { type: String }, // Jaise: Supermarket, Bakery, Dairy
    rating: { type: Number, default: 4.0 },

    // 📍 HYPERLOCAL LOGIC
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },

    isOpening: { type: Boolean, default: true },
    deliveryTime: { type: String, default: "20-30 min" }, // Zomato style timing
    verifiedMerchant: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shop', shopSchema);