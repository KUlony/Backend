const mongoose = require("mongoose");
const ReplySchema = new mongoose.Schema({
  reply_id : {
    type : Number,
    default : 0,
  },
  comment_id : {
    type : Number,
    required : true,
  },
  reply_content: {
    type: String,
    required: true,
  },
  reply_like_count : {
    type : Number,
    default : 0,
  },
  reply_time :{
    type : Date,
    default : Date.now(),
  },
  reply_status : {
    type : Boolean,
    default : true,
  },
  reply_delete_time : {
    type : Date,
    default : null,
  }
});
const Reply = mongoose.model("Reply", ReplySchema );
module.exports = Reply;