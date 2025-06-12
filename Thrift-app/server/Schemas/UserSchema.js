const { configDotenv } = require('dotenv');
const mongoose = require('mongoose');
const User= new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String, 
    default: null,
    required: false,
    minlength: 6
   
  },
  role:{
    type: String,
    enum: ['buyer','seller','admin'],
    default: 'buyer'

  },
  code:{
    type: String,
    required: false,
    default: null
  }
  ,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', User);