const { configDotenv } = require('dotenv');
const mongoose = require('mongoose');
const Product= new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    required: true,
  
   
  },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    imageUrl:
    {
  type: String,
  required: false,
    },
    search_terms:
    {
      type:[String],
      required:false
    },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', Product);