const mongoose = require('mongoose');
const CartItem=require('./CartItemSchema.js')
const Cart= new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    required: true,
  
  },
   SessionId: {
    type: String,
    default: null,
    required: true, 
  },
  items:
  {
    type:[CartItem],

  }

  
  
});

module.exports = mongoose.model('Cart', Cart);