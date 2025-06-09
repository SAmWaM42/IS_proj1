const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5000;
const url='mongodb+srv://sam42:Family567@projectclus0.nxy3i5v.mongodb.net/?retryWrites=true&w=majority&appName=ProjectClus0';

// MongoDB connection
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB error:", err));

// Middlewares
app.use(cors({
  origin: 'http://localhost:5500', // Adjust for frontend origin
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 15 * 60 * 1000 // 15 min session timeout
  }
}));

// Serve static HTML pages
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/products', productRoutes);
app.use('/users', userRoutes);

// Base test route
app.get('/', (req, res) => {
  res.json({ message: '🎉 Server is running' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});
