
const mongoose = require('mongoose');
const OTP= new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code:{
    type: String,
    required: false,
    default: null
  }
  ,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '5m' // OTP expires after 10 minutes
  }
});

module.exports = mongoose.model('OTP', OTP);