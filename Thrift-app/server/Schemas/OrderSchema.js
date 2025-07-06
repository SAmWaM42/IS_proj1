const mongoose = require('mongoose');
const OrderItem=require('./OrderItemSchema.js');
const Order= new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    required: true,
  
  },
  sellerId:
  {
 type: mongoose.Schema.Types.ObjectId,
    default: null,
    required: true,
  },
  transactionID:
  {
    type:String,
    required :true
  },
  b2cOriginatorConversationId: {
        type: String,
        required: false, // Set after B2C payout initiation
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
  status:
  {
    type:String
  },
  buyerReceiptID:
  {
    type:String,
      required: false,
  }
  ,
  sellerReceiptID:
  {
    type:String,
    required: false,

  }
  ,
  completionDate:
  {
    type: Date,
    required:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

  
});

module.exports =  mongoose.model('Order', Order);