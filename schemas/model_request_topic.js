const mongoose = require("mongoose");
const request_topicSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
	ref: 'user'
  },
  catagory_id : {
    type: mongoose.Schema.Types.ObjectId,
	ref: 'catagory'
  },
  request_topic : String,
  request_time :{
    type : Date,
    default : Date.now(),
  },
});
const request_topic = mongoose.model("request_topic", request_topicSchema );
module.exports = request_topic;