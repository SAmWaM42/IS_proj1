const express = require('express');
const session=require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const userroutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const multer = require('multer')
const path= require('path');


//temp cart list to store items added to cart



app.use(cors({origin: 'http://localhost:3000', credentials: true})); // Allow CORS for frontend
app.use(express.json());
app.use(cookieParser());


app.use(session({
  secret: 'a_very_secret_key_that_you_should_change', // REQUIRED: A strong, unguessable string
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  cookie: {
      secure: false, // Set to true if using HTTPS (recommended in production)
      maxAge: 1000 * 60 * 60 * 2 // 2hrs 
  }
}));

const uri = process.env.MONGODB_PRIVATE_URI
console.log(uri);// Use environment variable for production
mongoose.connect(uri)
    .then(() => console.log('MongoDB connection established successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));







const User = require('./Schemas/UserSchema'); 
const Product = require('./Schemas/ProductSchema');
 



app.use('/user', userroutes);
app.use('/product', productRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images from the Images directory	

app.get('/', (req, res) => {
    res.json({ message: 'Hello the homepage is working and so is the router!' });
});

app.get('/home', (req, res) => {
    res.json({ message: 'This is the home-page!' });

});
app.use((err, req, res, next) => {
    console.error("----- SERVER-SIDE ERROR CAUGHT -----");
    console.error("Full Error Object:", err); // <--- ADD THIS LINE!
    console.error("Error Message:", err.message);
    console.error("Error Stack:", err.stack); 

    // Check if it's a Multer error
    if (err instanceof multer.MulterError) {
        console.error("Multer Specific Error Code:", err.code);
        return res.status(400).json({
            message: `File upload error: ${err.message}`,
            code: err.code
        });
    }

    // For any other type of error
    res.status(err.status || 500).json({
        message: 'An unexpected server error occurred.',
        error: err.message
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

