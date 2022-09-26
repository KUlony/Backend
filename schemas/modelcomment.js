const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
  },
  comment_content: {
    type: String,
    required: true,
  },
  comment_like_count : {
    type : Number,
    default : 0,
  },
  comment_time :{
    type : Date,
    default : Date.now(),
  },
  comment_status : {
    type : Boolean,
    default : true,
  },
  comment_delete_time : {
    type : Date,
    default : null,
  }
});
const Comment = mongoose.model("Comment", CommentSchema );
module.exports = Comment;