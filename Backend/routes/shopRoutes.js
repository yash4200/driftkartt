const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

const getShopId = async (userId) => {
  const shop = await Shop.findOne({ user: userId });
  if (!shop) throw new Error('Shop profile not found');
  return shop._id;
};

// 🏪 Dashboard Stats
router.get('/dashboard', async (req, res) => {
  try {
    const shopId = await getShopId(req.user._id);

    const myProductsCount = await Product.countDocuments({ shopkeeper: shopId });

    // Orders that contain products from this shopkeeper
    // Mongoose aggregation for nested documents
    const orders = await Order.find({ 'items.product': { $in: await Product.find({ shopkeeper: shopId }).distinct('_id') } });
    
    // Filter out only the revenue and orders applicable to this specific shopkeeper
    let myRevenue = 0;
    let pendingOrders = 0;
    
    const shopProductIds = (await Product.find({ shopkeeper: shopId }).select('_id')).map(p => p._id.toString());

    orders.forEach(order => {
      let orderHasPending = order.status === 'pending';
      if (orderHasPending) pendingOrders++;

      if (order.isPaid) {
        order.items.forEach(item => {
          if (shopProductIds.includes(item.product.toString())) {
            myRevenue += (item.price * item.quantity);
          }
        });
      }
    });

    res.json({
      myProducts: myProductsCount,
      myOrders: orders.length,
      myRevenue,
      pendingOrders,
      topProducts: [], // Placeholder
      monthlySales: [] // Placeholder
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🏪 Products Management
router.route('/products')
  .get(async (req, res) => {
    try {
      const shopId = await getShopId(req.user._id);
      const products = await Product.find({ shopkeeper: shopId });
      res.json(products);
    } catch (err) { res.status(500).json({ message: err.message }) }
  })
  .post(async (req, res) => {
    try {
      const shopId = await getShopId(req.user._id);
      const prod = new Product({
        ...req.body,
        shopkeeper: shopId
      });
      await prod.save();
      res.status(201).json(prod);
    } catch (err) { res.status(500).json({ message: err.message }) }
  });

router.route('/products/:id')
  .put(async (req, res) => {
    try {
      const shopId = await getShopId(req.user._id);
      const product = await Product.findOne({ _id: req.params.id, shopkeeper: shopId });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      
      Object.assign(product, req.body);
      await product.save();
      res.json(product);
    } catch (err) { res.status(500).json({ message: err.message }) }
  })
  .delete(async (req, res) => {
    try {
      const shopId = await getShopId(req.user._id);
      const product = await Product.findOneAndDelete({ _id: req.params.id, shopkeeper: shopId });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json({ message: 'Product removed' });
    } catch (err) { res.status(500).json({ message: err.message }) }
  });

// 🏪 Orders Management
router.get('/orders', async (req, res) => {
  try {
    const shopId = await getShopId(req.user._id);
    const shopProducts = await Product.find({ shopkeeper: shopId }).distinct('_id');
    const orders = await Order.find({ 'items.product': { $in: shopProducts } })
      .populate('user', 'name email phone')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    // Map orders to only show items belonging to this shopkeeper
    const filteredOrders = orders.map(order => {
      const myItems = order.items.filter(item => shopProducts.some(id => id.equals(item.product._id)));
      return {
        ...order.toObject(),
        items: myItems,
        totalAmount: myItems.reduce((acc, it) => acc + (it.price * it.quantity), 0)
      };
    });

    res.json(filteredOrders);
  } catch (err) { res.status(500).json({ message: err.message }) }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const shopId = await getShopId(req.user._id);
    const shopProducts = await Product.find({ shopkeeper: shopId }).distinct('_id');
    // Security check: Make sure order contains our product
    const order = await Order.findOne({ _id: req.params.id, 'items.product': { $in: shopProducts } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }) }
});

// 🏪 Reviews
router.get('/reviews', async (req, res) => {
  try {
    const shopId = await getShopId(req.user._id);
    const shopProducts = await Product.find({ shopkeeper: shopId }).distinct('_id');
    const reviews = await Review.find({ product: { $in: shopProducts } }).populate('user', 'name').populate('product', 'name');
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }) }
});

// 🏪 Profile
router.route('/profile')
  .get(async (req, res) => {
    try {
      const shop = await Shop.findOne({ user: req.user._id });
      res.json(shop);
    } catch (err) { res.status(500).json({ message: err.message }) }
  })
  .put(async (req, res) => {
    try {
      const shop = await Shop.findOne({ user: req.user._id });
      if (!shop) return res.status(404).json({ message: 'Shop profile not found' });
      
      Object.assign(shop, req.body);
      await shop.save();
      res.json(shop);
    } catch (err) { res.status(500).json({ message: err.message }) }
  });

module.exports = router;
