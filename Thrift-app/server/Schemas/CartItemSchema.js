const mongoose = require('mongoose');
const CartItem= new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ProductID: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    required: true,
  
   
  },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity:{
        type:Number,
        required:true,
        min:0,
        default:1
    }
    
});

module.exports = mongoose.model('CartItem', CartItem);