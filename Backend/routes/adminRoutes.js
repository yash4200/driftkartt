const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get global administrative dashboard data
// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false, isShopkeeper: false });
    const totalShopkeepers = await User.countDocuments({ isShopkeeper: true });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Revenue aggregator
    const deliveredOrders = await Order.find({ status: 'delivered', isPaid: true });
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');

    // Aggregate monthly sales for the last 6 months
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlySalesAggr = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo },
          isPaid: true
        } 
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySalesData = monthlySalesAggr.map(m => ({
      name: months[m._id.month - 1],
      revenue: m.revenue
    }));

    // Placeholder for categorywise and top selling logic (to be scaled)
    const categoryWiseSales = [
      { name: 'Helmets', value: 8000 },
      { name: 'Tyres', value: 12000 },
      { name: 'Accessories', value: 5000 }
    ];
    
    const topSellingProducts = [];

    res.json({
      totalUsers,
      totalShopkeepers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      monthlySalesData,
      categoryWiseSales,
      topSellingProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isShopkeeper: false, isAdmin: false }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id/make-admin', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isAdmin = true;
    await user.save();
    res.json({ message: 'User is now an admin' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Shopkeepers
router.get('/shopkeepers', async (req, res) => {
  try {
    const shopkeepers = await User.find({ isShopkeeper: true }).select('-password');
    res.json(shopkeepers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/shopkeepers/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Find shop matching user
    await Shop.findOneAndDelete({ user: req.params.id });
    res.json({ message: 'Shopkeeper deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Products & Orders (Global ReadOnly / Delete)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('shopkeeper', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;