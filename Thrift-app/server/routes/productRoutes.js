const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const User = require('../../models/user');

// POST a new product
router.post('/', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not logged in' });

  const { name, description, price, imageUrl } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      seller: req.session.user.id,
    });

    await product.save();

    const user = await User.findById(req.session.user.id);
    user.products.push(product._id);
    await user.save();

    res.json({ message: 'Product posted successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to post product', error: err.message });
  }
});

// GET all products
router.get('/', async (req, res) => {
  const products = await Product.find().populate('seller', 'name profilePicture');
  res.json(products);
});

module.exports = router;
