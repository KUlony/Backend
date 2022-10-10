const mongoose = require("mongoose");
const sing_upSchema = new mongoose.Schema({
  
  email: {
    type: String,
	
  },
  password :{
    type : String,
   
    
  },
  verified : {
    type : Boolean,
    default : false
  },
  status_login : {
    type : Boolean,
    default : false
  }
});
const sing_up = mongoose.model("sing-up", sing_upSchema );
module.exports = sing_up;