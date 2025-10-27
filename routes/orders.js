const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Create order
router.post('/', auth, async (req, res) => {
  const { items, total } = req.body; // items: [{product, quantity, price}]
  const order = new Order({ user: req.user._id, items, total });
  await order.save();
  res.status(201).json(order);
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
});

module.exports = router;
