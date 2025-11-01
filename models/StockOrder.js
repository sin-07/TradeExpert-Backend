const mongoose = require('mongoose');

const StockOrderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  symbol: { 
    type: String, 
    required: true 
  },
  stockName: {
    type: String,
    required: true
  },
  orderType: { 
    type: String, 
    enum: ['Market', 'Limit'], 
    required: true 
  },
  side: { 
    type: String, 
    enum: ['Buy', 'Sell'], 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1
  },
  price: { 
    type: Number, 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Filled', 'Cancelled', 'Rejected'], 
    default: 'Filled' 
  },
  market: {
    type: String,
    enum: ['indian', 'us', 'crypto'],
    required: true
  },
  executedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Index for faster queries
StockOrderSchema.index({ user: 1, createdAt: -1 });
StockOrderSchema.index({ user: 1, symbol: 1 });

module.exports = mongoose.model('StockOrder', StockOrderSchema);
