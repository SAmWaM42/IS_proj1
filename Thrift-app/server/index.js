const express = require('express');
const session=require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const userroutes = require('./routes/userRoutes');

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


const uri = process.env.MONGODB_PRIVATE_URI 
console.log(uri);// Use environment variable for production
mongoose.connect(uri)
    .then(() => console.log('MongoDB connection established successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

const User = require('./Schemas/UserSchema'); 
 



app.use('/user', userroutes);

app.get('/', (req, res) => {
    res.json({ message: 'Hello the homepage is working and so is the router!' });
});

app.get('/home', (req, res) => {
    res.json({ message: 'This is the home-page!' });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

