const shopkeeper = (req, res, next) => {
  if (req.user && req.user.isShopkeeper) {
    next();
  } else {
    res.status(403).json({ message: 'Shopkeeper access only' });
  }
};

module.exports = { shopkeeper };
