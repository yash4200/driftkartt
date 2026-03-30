const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // 🚩 VENDOR LOGIC: Kis shop ka order hai
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopName: { type: String },

    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 }
    }],

    totalAmount: { type: Number, required: true },

    // 👤 CUSTOMER DETAILS
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String },
    shippingAddress: {
        street: String,
        city: String,
        zipCode: String
    },

    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },

    paymentMethod: { type: String, default: 'Cash on Delivery' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);