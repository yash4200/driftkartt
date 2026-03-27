const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    storeName: String,
    distance: String,
    category: String,
    image: String
});

module.exports = mongoose.model('Product', ProductSchema);