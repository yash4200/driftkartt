const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    storeName: String,
    distance: String,
    category: String,
    image: String
});

// Check karo ki 'Product' ka spelling sahi ho
module.exports = mongoose.model('Product', ProductSchema);