const express = require('express');
const router = express.Router();
const Product = require('../Schemas/ProductSchema'); // Import the Product model
const User = require('../Schemas/UserSchema'); // Import the User model
const multer = require('multer'); // For handling file uploads
const path= require('path'); // For handling file path
const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.join(__dirname,'..', '/images')); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Append original file extension
    }
});
const upload = multer({ storage: storage });

// POST a new product
router.post('/',upload.single('image'), async (req, res) =>
  {

  console.log("Received request to post a product:",req.file, req.body);

  console.log("Request session user:", req.session.user);
  if (!req.session.user) return res.status(401).json({ message: 'Not logged in' });
  const imageUrl=req.file?`images/${req.file.filename}`:null; // Assuming the image URL is sent in the request body
   
  

  const { name, description, price } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      UserID: req.session.user.id,
    });
    console.log("Product to be saved:", product);
    await product.save();

    res.json({ message: 'Product posted successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to post product', error: err.message });
  }
});

// GET all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
router.get('/:id', async (req, res) => {

const {id}=req.params;
  console.log(id);
  const products = await Product.findById(id);
  res.json(products);
});



module.exports = router;
