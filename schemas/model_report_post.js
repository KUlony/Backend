const mongoose = require("mongoose");
const report_postSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
	ref: 'user'
  },
  entity_id: {
    type: mongoose.Schema.Types.ObjectId,
	ref: 'post'
  },
  entity_type : String,
  report_type : String,
  report_time :{
    type : Date,
    default : Date.now(),
  },
});
const report_post = mongoose.model("report_post", report_postSchema );
module.exports = report_post;