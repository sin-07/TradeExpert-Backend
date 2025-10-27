const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// GET list
router.get('/', async (req, res) => {
  const products = await Product.find().limit(100);
  res.json(products);
});

// GET one
router.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
});

// Admin: create product
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  const { title, description, price } = req.body;
  const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
  const product = new Product({ title, description, price, images });
  await product.save();
  res.status(201).json(product);
});

module.exports = router;
