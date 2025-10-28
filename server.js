require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

console.log('[STARTUP] TradeXpert Backend v1.1 - Resend Email Integration');
console.log('[STARTUP] Email method:', process.env.RESEND_API_KEY ? 'Resend API' : 'Gmail SMTP');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const stockRoutes = require('./routes/stocks');
const searchRoutes = require('./routes/search');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/tradexpert');

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration - works for both dev and production
const allowedOrigins = [
  'http://localhost:5173', // Development
  'http://localhost:3000', // Alternative dev port
  'https://trade-expert-frontend.vercel.app', // Production frontend
  'https://tradeexpert-backend.onrender.com', // Production backend
  process.env.FRONTEND_URL, // From .env (dev)
  process.env.PRODUCTION_URL, // From .env (production)
].filter(Boolean);

app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Rate limiter - increased limits for development
const limiter = rateLimit({ 
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 1000, // 1000 requests per minute
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route - API info
app.get('/', (req, res) => {
  res.json({
    name: 'TradeXpert API',
    version: '1.0.0',
    status: 'running',
    message: 'Welcome to TradeXpert Backend API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      stocks: '/api/stocks',
      search: '/api/search'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/search', searchRoutes);

// Health
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
