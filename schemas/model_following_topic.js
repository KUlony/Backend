const mongoose = require("mongoose");
const following_topicSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
	ref: 'user'
  },
  topic_id: {
    type: mongoose.Schema.Types.ObjectId,
	ref: 'topic'
  },
  follow_time :{
    type : Date,
    default : Date.now(),
  },
});
const following_topic = mongoose.model("following_topic", following_topicSchema );
module.exports = following_topic;