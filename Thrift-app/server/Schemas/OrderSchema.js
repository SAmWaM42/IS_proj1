const mongoose = require('mongoose');
const OrderItem=require('./OrderItemSchema.js')
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
    type:[OrderItem.schema],
    
  }
  ,
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

  
});

module.exports = mongoose.model('Cart', Cart);