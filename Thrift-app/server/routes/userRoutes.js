// Import express-session 
const express = require('express');

// Load environment variables from .env file


const bcrypt = require('bcrypt');
const User = require('../Schemas/UserSchema'); // Adjust the path as necessary
const chatbox = require('../Schemas/messages');
const OTP = require('../Schemas/OTP'); // Adjust the path as necessary
const nodemailer = require('nodemailer');// For sending emails
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const path = require('path'); // For handling file path
const { default: mongoose } = require('mongoose');
const messages = require('../Schemas/messages');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(__dirname, ' ..', 'images'); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Append original file extension
  }
});
const upload = multer({ storage: storage });
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
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
    text: `You are registering to ${process.env.APP_NAME} your OTP code is ${code} it will expire in 5 minutes`, // Plain text body
    html: `<p>Your OTP code is <strong>${code}</strong> it will expire in 5 minutes</p>` // HTML body
  });
  console.log(`OTP sent to ${email}`);

};
// REGISTER
router.post('/register', upload.none(), async (req, res) => {
  const { name, email, phoneNumber, role } = req.body;
  console.log(req.body);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });
    const currentDate = new Date();
    const da = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const code = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
    const user = new User({ name: name, email: email, phoneNumber: phoneNumber, role: role }); // Default role can be set to 'buyer' or any other role as needed
    const otp = new OTP({ userId: user._id, code: code });
    await user.save();
    await otp.save();

    //OTP sending logic
    const emailSent = await sendOTPEmail(email, code);

    res.status(201).json({ message: 'Data succesfully sent.', userId: user._id, redirect: '/auth' });

  } catch (err) {
    res.status(500).json({ message: 'Registration error or Email not sent', error: err.message });
  }
});
//2FA confirmation endpoint
router.post('/2FA', upload.none(), async (req, res) => {
  const { code, password, confirm_password } = req.body;
  console.log(req.body);
  try {
    const otp = await OTP.findOne({ code: code });
    if (!otp) return res.status(400).json({ message: 'Invalid or Expired OTP code' });

    const userId = otp.userId;
    if (password !== confirm_password) {
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
    res.status(201).json({ message: 'User registered', myData:updatedUser,redirect:'/Dashboard'});
  } catch (err) {
    res.status(500).json({ message: 'Registration/Confirmation error', error: err.message });
  }
});
//update route
router.post('/update', async (req, res) => {
  console.log("received update",req.body);
  const { name, email, id, oldPassword, newPassword, phoneNumber, role } = req.body;
  
  try {
    const me = await User.findById(id);
    if (!me) return res.status(400).json({ message: 'no user with the above ID exists' });
     const updates = {};

       if (oldPassword && newPassword) {
         if (newPassword.trim() === '') {
                return res.status(400).json({ message: 'New password cannot be empty.' });
            }
          
    const match = bcrypt.compare(oldPassword, me.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'oldPassword not correct' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
     updates.passwordHash = hashedPassword;

    }else if (oldPassword || newPassword) {
            // If only one password field is provided, it's an error
            return res.status(400).json({ message: 'Both old and new password are required to change password.' });
        }
    const fieldsToUpdate = ['name', 'email', 'phoneNumber', 'role'];
     fieldsToUpdate.forEach(field => {
           if (req.body[field] !== undefined && req.body[field] !== null && req.body[field].toString().trim() !== '') {
             if (req.body[field] !== me[field]) { // Only update if different from current value
                    updates[field] = req.body[field];
                }
            }
        });
         if (updates.role && !['buyer', 'seller'].includes(updates.role)) {
            return res.status(400).json({ message: 'Invalid role provided.' });
        }

          if (Object.keys(updates).length === 0) {
            return res.status(200).json({ message: 'No changes provided to update.' }); // Indicate no update needed
        }
    const updatedUser = await User.findByIdAndUpdate(
      {_id:id},
    { $set: updates },
      
      { new: true, runValidators: true } // 'new: true' returns the updated document, 'runValidators: true' runs schema validations
    );

    if (!updatedUser) {
      return res.status(500).json({ message: 'Update failed' });
    }
     res.status(200).json({
            message: 'Profile updated successfully!', // Correct success message
            user: { // Send back relevant updated user data (avoid sending passwordHash)
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber,
                role: updatedUser.role
            }
        });
   
  } catch (err) {
    res.status(500).json({ message: 'Update error', error: err.message });
  }
});




// LOGIN
router.post('/login', upload.none(), async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = { id: user._id, name: user.name };
    res.status(200).json({ message: 'Login successful',myData:user,redirect:'/Dashboard' });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// LOGOUT
router.get('/logout', upload.none(), (req, res) => {
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
    const user = await User.findById(req.session.user.id);
    console.log("Fetched user:", user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {

    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});


router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

router.post('/chats', async (req, res) => {
  try {
    const me = req.session.user.id;
    const { otherUser } = req.body;
    if (!otherUser || !mongoose.Types.ObjectId.isValid(otherUser)) {
      return res.status(400).json({ message: 'Invalid or missing otherUserId' });
    }
    let Chatbox = await chatbox.findOne({
      ParticipantsId: { $all: [me, otherUser], $size: 2 }
    });
    if (Chatbox) {
      return res.status(200).json({ chatId: Chatbox._id.toString(), message: 'Existing chat found' });
    }

    Chatbox = new chatbox
      ({
        ParticipantsId: [me, otherUser],
        messages: []
      });
    await Chatbox.save();
    res.status(201).json({ chatId: Chatbox._id.toString(), message: 'New chat created' });
  } catch (err) {
    console.error('Error creating or getting chatbox:', err);
    res.status(500).json({ message: 'Server error creating or getting chatbox', error: err.message });

  }



});
router.get('/chats', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const userChats = await chatbox.find({ ParticipantsId: req.session.user.id }).populate('ParticipantsId', 'name');
    console.log("Fetched chats:", userChats);

    const structuredChats = userChats.map(chat => {

      const participants = chat.ParticipantsId.filter(p => p && p.name).map(p => ({
        _id: p._id.toString(), // Convert ObjectId to string for consistency
        name: p.name,
      }));
      let chatName = 'GroupChat';
      const otherParticipant = participants.find(p => p._id !== req.session.user.id.toString());


      if (participants.length === 2) {
        chatName = otherParticipant.name;
      }
      else {
        chatName = "Group Chat";
      }




      return {
        _id: chat._id.toString(), // The chatbox ID
        name: chatName, // The derived name for the frontend list
        messages: chat.message.map(msg => ({ // Ensure messages are properly formatted too
          SenderId: msg.SenderId.toString(),
          text: msg.text,
          timestamp: msg.timestamp
        })),
        participants: participants, // Full participant details
        lastMessageAt: chat.lastMessageAt,
        // Add any other fields from your chatbox model that the frontend needs
      };
    });
    res.status(200).json(structuredChats);

  } catch (err) {
    console.error("Error in /chats GET endpoint:", err); // Log the basic error object
    console.error("Full Stack Trace:", err.stack);     // <--- THIS IS WHAT WE NEED!
    // --- END CRITICAL CHANGE ---

    res.status(500).json({ message: 'Error fetching user', error: err.message });

  }
});
router.get('/chats/:chatId', async (req, res) => {
  const { chatId } = req.params;
  try {

    let Chatbox = await chatbox.findById(chatId);
    return res.status(200).json(Chatbox);

  } catch (err) {
    console.error('Error creating or getting chatbox:', err);
    res.status(500).json({ message: 'Server error creating or getting chatbox', error: err.message });

  }

});



router.post('/chats/:chatId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  const { chatId } = req.params;
  const { text } = req.body;

  try {
    const chat = await chatbox.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const newMessage = {
      text,
      SenderId: new mongoose.Types.ObjectId(req.session.user.id),
      isRead: false,
      isDelivered: false,
      timestamp: new Date()
    };

    chat.message.push(newMessage);
    await chat.save();

    res.json({ message: 'Message sent', newMessage });
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }

});
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    console.log("Fetched user:", user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {

    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});


module.exports = router;

