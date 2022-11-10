const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  school : {
    type : String,
    default : null,
  },
  degree : {
    type : String,
    default : null
  },
  field_of_study : {
    type : String,
    default : null
  },
  start_date : {
    type : String,
    default : null
  },
  end_date : {
    type : String,
    default : null
  }
});

const contactSchema = new mongoose.Schema({
  facebook : {
    type : String,
    default : null
  },
  ig : {
    type : String,
    default : null
  }
})

const UserSchema = new mongoose.Schema({
  visit_post : [mongoose.Schema.Types.ObjectId],
  user_name : {
    type : String,
    default : null,
  },
  user_firstname : {
    type : String,
    default : null,
  },
  user_lastname : {
    type : String,
    default : null,
  },
  education : [{
    type : educationSchema,
    default : null
  }],
  contact : {
    type : contactSchema,
    default : null
  },
  user_bio : {
    type : String,
    default : null,
  },
  profile_pic_url : {
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
  verified_resetpassword : {
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