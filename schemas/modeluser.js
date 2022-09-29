const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  visit_post : [mongoose.Schema.Types.ObjectId],
  user_name : {
    type : String,
    required : true,
  },
  user_firtname : {
    type : String,
    required : true,
  },
  user_lastname : {
    type : String,
    required : true,
  },
  user_bio : {
    type : String,
    required : true,
  },
  ku_gen : {
    type : Number,
    required : true,
  },
  profile_pic_url : {
    type : String,
    required : true,
  },
  faculty : {
    type : String,
    required : true,
  },
  department : {
    type : String,
    required : true,
  },
  campus : {
    type : String,
    required : true,
  },
  gender : {
    type : String,
    required : true,
  },
  admin : {
    type : Boolean,
    default : false,
  },
  email : {
    type : String,
    required : true,
  },
  password : {
    type : String,
    required : true,
  },
  email_verify : {
    type : Boolean,
    default : true,
  },
  last_login : {
    type : Date,
    default : Date.now(),
  },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;