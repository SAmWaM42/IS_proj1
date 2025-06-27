const mongoose = require('mongoose');

const Message= new mongoose.Schema({

      SenderId:
    {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    required: true,
  },
  text:{
    type:String,
    required: true,
    trim: true
  }
  ,
    isRead: {
        type: Boolean,
        default: false
  },
    isDelivered: {
            type: Boolean,
            default: false
    },
   timestamp:{
  type: Date,
  default: Date.now,
  required: true,
  index: true

   }
  
  
});

const chatbox= new mongoose.Schema({
  name:
{
  type:String,
  
},
    ParticipantsId:
    {
    type: [mongoose.Schema.Types.ObjectId],
    default: null,
    required: true,
  },
  message:
    {
        type: [Message.schema],
        required: true
    },
   CreatedAt:{
  type: Date,
  default: Date.now,
  required: true,
  index: true

   }
  
  

  
});



module.exports = mongoose.model('chatbox', chatbox);