const mongoose = require("mongoose");
const ReplySchema = new mongoose.Schema({
  comment_id : {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
  },
  user_id : {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
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
    type : String,
    default : "visible",
  },
  reply_delete_time : {
    type : Date,
    default : null,
  }
});
const Reply = mongoose.model("Reply", ReplySchema );
module.exports = Reply;