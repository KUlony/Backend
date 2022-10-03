const mongoose = require("mongoose");
const like_post_Schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
	ref: 'user'
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
	ref: 'topic'
  },
  like_time :{
    type : Date,
    default : Date.now(),
  },
});
const like_post = mongoose.model("like_post", like_post_Schema );
module.exports = like_post;