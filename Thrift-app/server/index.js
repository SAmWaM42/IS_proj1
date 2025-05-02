const express = require('express');
const session=require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 5000;
//temp cart list to store items added to cart


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
session({
    secret: 'your_secret_key',
    resave: false    ,
    saveUninitialized: true
}));
const user =
 { 
    name: '',
    email: '',
    password: '',
    id:0,
    role:'',
    cart:[],

 }

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
app.post('/login', (req, res) => {
    const { name, email, password } = req.body;
    user.name = name;
    user.email = email;
    user.password = password;
    user.id = 1; // Example ID
    user.role = 'user'; // Example role
    req.session.user = user; // Store user in session
    res.json({ message: 'User logged in successfully!' });
});


app.get('/', (req, res) => {
    res.json({ message: 'Hello the homepage is working and so is the router!' });
});

app.get('/home', (req, res) => {
    res.json({ message: 'This is the home-page!' });
});
app.get('/test', (req, res) => {
    res.json({ message: 'i am actually doing something!' });
});


app.get('/cart', (req, res) => {
    if (req.session.user) {
        res.json({ cart: req.session.cart_list });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.post('/cart', (req, res) => {
    const item = req.body;
    console.log('Item added to cart:', item);
    res.json({ message: 'Item added to cart!' });
    if(req.session.user)
    {
         req.session.cart_list.push(item)
    }
}); 

