require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../Schemas/UserSchema'); // Adjust the path as necessary
const OTP = require('../Schemas/OTP'); // Adjust the path as necessary
const nodemailer = require('nodemailer'); // For sending emails
const router = express.Router();
const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS // Your email password or app password
    },
    tls:
    {
        rejectUnauthorized: false // This is to allow self-signed certificates, not recommended for production
    }

});
async function sendOTPEmail(email, code) {
  
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender address
      to: email, // List of recipients
      subject: 'Your OTP Code', // Subject line
      text: `Your OTP code is ${code} it will expire in 5 minutes`, // Plain text body
      html: `<p>Your OTP code is <strong>${code}</strong> it will expire in 5 minutes</p>` // HTML body
    });
      console.log(`OTP sent to ${email}`);
  
};
// REGISTER
router.post('/register', async (req, res) => {
  const {name, email} = req.body;
  console.log(req.body);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });
    const currentDate = new Date();
    const da = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const code = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
    const user = new User({ name:name, email:email}); // Default role can be set to 'buyer' or any other role as needed
    const otp = new OTP({ userId: user._id, code: code });
    await user.save();
    await otp.save();

    //OTP sending logic
    const emailSent = await sendOTPEmail(email, code);

    res.status(201).json({ message: 'Data succesfully sent.', userId: user._id ,redirect:'/auth'});
    
  } catch (err) {
    res.status(500).json({ message: 'Registration error or Email not sent', error: err.message });
  }
});
//2FA confirmation endpoint
router.post('/2FA', async (req, res) => {
  const {code, password ,confirm_password } = req.body;
  console.log(req.body);
  try {
   const otp = await OTP.findOne({ code: code });
    if (!otp) return res.status(400).json({ message: 'Invalid or Expired OTP code' });
   
    const userId = otp.userId;
   if( password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
     const updatedUser = await User.findByIdAndUpdate(
            userId,
            { passwordHash: hashedPassword }, // The field name is 'passwordHash' from your schema!
            { new: true, runValidators: true } // 'new: true' returns the updated document, 'runValidators: true' runs schema validations
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
    req.session.user = { id: updatedUser._id, name: updatedUser.name };
    await OTP.deleteOne({ _id: otp._id }); // Delete the OTP after successful confirmation
    res.status(201).json({ message: 'User registered', userId: updatedUser._id });
  } catch (err) {
    res.status(500).json({ message: 'Registration/Confirmation error', error: err.message });
  }
});



// LOGIN
router.post('/login', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = { id: user._id, name: user.name };
    res.status(200).json({ message: 'Login successful', userId: user._id  });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// GET CURRENT USER PROFILE via session
router.get('/me', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const user = await User.findById(req.session.user.id).populate('products');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

module.exports = router;

