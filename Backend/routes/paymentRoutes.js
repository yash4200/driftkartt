const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Create a razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Amount in paise (multiply by 100)
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Razorpay Order Error:', err);
    res.status(500).json({ message: "Something went wrong creating payment order." });
  }
});

// POST /api/payment/verify
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, driftkartOrderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Find the existing driftkart order and mark it as paid
      const order = await Order.findById(driftkartOrderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentId = razorpay_payment_id;
        order.razorpayOrderId = razorpay_order_id;
        order.status = 'confirmed'; // automatically confirm paid orders
        await order.save();
      }
      
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid Signature!" });
    }
  } catch (err) {
    console.error('Razorpay Verify Error:', err);
    res.status(500).json({ message: "Server error verifying payment" });
  }
});

module.exports = router;
