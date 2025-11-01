const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const StockOrder = require('../models/StockOrder');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const { sendOrderConfirmationEmail } = require('../email/emailService');

// Get user portfolio
router.get('/portfolio', auth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    
    // Create portfolio if doesn't exist
    if (!portfolio) {
      portfolio = new Portfolio({
        user: req.user.id,
        balance: 50000,
        positions: [],
        totalPnL: 0
      });
      await portfolio.save();
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Place a new order (Buy or Sell)
router.post('/place-order', auth, async (req, res) => {
  try {
    const { symbol, stockName, orderType, side, quantity, price, market } = req.body;
    
    // Validation
    if (!symbol || !stockName || !orderType || !side || !quantity || !price || !market) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }
    
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }
    
    const totalAmount = parseFloat((quantity * price).toFixed(2));
    
    // Get or create portfolio
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) {
      portfolio = new Portfolio({
        user: req.user.id,
        balance: 50000,
        positions: []
      });
    }
    
    // Check balance for Buy orders
    if (side === 'Buy') {
      if (portfolio.balance < totalAmount) {
        return res.status(400).json({ 
          message: `Insufficient balance. Required: ₹${totalAmount.toFixed(2)}, Available: ₹${portfolio.balance.toFixed(2)}` 
        });
      }
      
      // Deduct from balance
      portfolio.balance -= totalAmount;
      
      // Add to positions
      const existingPosition = portfolio.positions.find(
        pos => pos.symbol === symbol && pos.side === 'Buy'
      );
      
      if (existingPosition) {
        // Update existing position (average price calculation)
        const prevCost = existingPosition.averagePrice * existingPosition.quantity;
        const newCost = price * quantity;
        const totalQty = existingPosition.quantity + quantity;
        existingPosition.averagePrice = (prevCost + newCost) / totalQty;
        existingPosition.quantity = totalQty;
        existingPosition.lastUpdated = new Date();
      } else {
        // Create new position
        portfolio.positions.push({
          symbol,
          stockName,
          side: 'Buy',
          quantity,
          averagePrice: price,
          market,
          lastUpdated: new Date()
        });
      }
    } 
    // Handle Sell orders
    else if (side === 'Sell') {
      // Check if user has the stock to sell
      const position = portfolio.positions.find(
        pos => pos.symbol === symbol && pos.side === 'Buy'
      );
      
      if (!position || position.quantity < quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock quantity. You have ${position ? position.quantity : 0} shares of ${symbol}` 
        });
      }
      
      // Add to balance
      portfolio.balance += totalAmount;
      
      // Reduce position quantity
      position.quantity -= quantity;
      position.lastUpdated = new Date();
      
      // Remove position if quantity is 0
      if (position.quantity === 0) {
        portfolio.positions = portfolio.positions.filter(
          pos => !(pos.symbol === symbol && pos.side === 'Buy')
        );
      }
    }
    
    // Save portfolio
    await portfolio.save();
    
    // Create order record
    const order = new StockOrder({
      user: req.user.id,
      symbol,
      stockName,
      orderType,
      side,
      quantity,
      price,
      totalAmount,
      status: 'Filled',
      market,
      executedAt: new Date()
    });
    
    await order.save();
    
    // Get user details for email
    const user = await User.findById(req.user.id);
    
    // Send order confirmation email (non-blocking)
    if (user && user.email) {
      sendOrderConfirmationEmail(user.email, user.name, {
        orderId: order._id.toString().slice(-8).toUpperCase(),
        symbol,
        stockName,
        side,
        orderType,
        quantity,
        price,
        totalAmount,
        market,
        executedAt: order.executedAt
      }).catch(err => {
        console.error('Failed to send order confirmation email:', err);
        // Don't block the response if email fails
      });
    }
    
    res.status(201).json({
      message: `Order ${side.toLowerCase()} successfully!`,
      order,
      portfolio: {
        balance: portfolio.balance,
        positions: portfolio.positions
      }
    });
    
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's order history
router.get('/orders', auth, async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const orders = await StockOrder.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await StockOrder.countDocuments({ user: req.user.id });
    
    res.json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's positions
router.get('/positions', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      return res.json({ positions: [] });
    }
    
    res.json({ positions: portfolio.positions });
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update portfolio balance (admin only - for testing)
router.put('/portfolio/balance', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      portfolio = new Portfolio({
        user: req.user.id,
        balance: amount,
        positions: []
      });
    } else {
      portfolio.balance = amount;
    }
    
    await portfolio.save();
    
    res.json({ message: 'Balance updated successfully', balance: portfolio.balance });
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
