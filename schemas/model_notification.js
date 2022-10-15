const mongoose = require("mongoose");
const notice = new mongoose.Schema({
   content_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },

   content_id :{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
   },
   action_user_id :{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   notice_type : String,
   notice_time : {
      type: Date,
      default: Date.now(),
   },
   readed : {
      type: Boolean,
      default: false,
   }
});
const Notice = mongoose.model("notice", notice)
module.exports = Notice