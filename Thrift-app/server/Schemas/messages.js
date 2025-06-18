const mongoose = require('mongoose');

const Message= new mongoose.Schema({

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

  
});



module.exports = mongoose.model('message', Message);