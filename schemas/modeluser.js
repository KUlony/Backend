const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  visit_post : [mongoose.Schema.Types.ObjectId],
  user_name : {
    type : String,
    default : null,
  },
  user_firtname : {
    type : String,
    default : null,
  },
  user_lastname : {
    type : String,
    default : null,
  },
  user_bio : {
    type : String,
    default : null,
  },
  ku_gen : {
    type : Number,
    default : null,
  },
  profile_pic_url : {
    type : String,
    default : null,
  },
  faculty : {
    type : String,
    default : null,
  },
  department : {
    type : String,
    default : null,
  },
  campus : {
    type : String,
    default : null,
  },
  gender : {
    type : String,
    default : null,
  },
  admin : {
    type : Boolean,
    default : false,
  },
  email : {
    type : String,
    
  },
  password : {
    type : String,
    
  },
  verified : {
    type : Boolean,
    default : false
  },
  last_login : {
    type : Date,
    default : null,
  },
  status_login : {
    type : Boolean,
    default : false
  }
});
const User = mongoose.model("User", UserSchema);
module.exports = User;