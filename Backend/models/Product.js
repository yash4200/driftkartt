const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    storeName: { type: String, required: true },
    distance: { type: String, default: "1.0 km" },
    category: { type: String },
    image: { type: String }
});

module.exports = mongoose.model('Product', ProductSchema);