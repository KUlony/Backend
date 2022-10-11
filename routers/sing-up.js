const express = require("express");
const router = express.Router()
const sendEmail = require("../config/email");
const Otp = require("../schemas/modelotp");
const UserModel = require("../schemas/modeluser");
const Math = require('math');
const {compareSync} = require('bcrypt');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post("/register/email", async (req, res) => {
  try {
    const { email,password, confirmpassword } = req.body;
    if ( !email || !password || !confirmpassword) {
      res.status(400).send('Please enter all fields');
    }
    
    let user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(400).send("User with given email already exist!")
    }
    if (password != confirmpassword) {
      res.status(400).send('Passwords do not match' );
      
    }
   
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    
    user = await new UserModel({
      email: req.body.email,
      password :  hashedPassword
    }).save();
    
    const OTP = Math.floor(100000 + Math.random()*900000);
    console.log(OTP);
      
    let otp = await new Otp({
      email: req.body.email,
      otp:OTP.toString()
    }).save();
      
    const message = OTP.toString()
    await sendEmail(user.email, "Verify Email", message);
  
    res.send("An Email sent to your account please verify");
      
  } catch (error) {
    res.status(400).send("An error occured");
  }
  
});
  
router.get("/register/email/checkOTP", async (req, res) => {
    try {
      
      const user = await UserModel.findOne({ email: req.body.email });
      
      if (!user) return res.status(400).send("Not find email");
  
      const otp = await Otp.findOne({
        email: req.body.email,
       
      });
      
      
      
      if (!otp) return res.status(400).send("Not find OTP");
      
      if (otp.otp == req.body.otp ) {
        await user.updateOne({  verified: true });
      };
      
      
  
      
      await Otp.findByIdAndRemove(otp._id);
  
      res.send("email verified sucessfully");
    } catch (error) {
      res.status(400).send("An error occured");
    }
});

  
router.post('/login',async (req, res) => {
  try {
    const user =  await UserModel.findOne({ email: req.body.email })


    
    if (!user) {
      res.status(401).send({
          success: false,
          message: "Could not find the email."
      })
    }

    if (!user.verified) {
      res.status(401).send({
        success: false,
        message: "Verify email againt"
    })
    }
    

    // Incorrect password
    if (!compareSync(req.body.password, user.password)) {
      res.status(401).send({
        success: false,
        message: "Incorrect password"
      })
    }
    

    const payload = {
      email: user.email,
      id: user._id,
      verified : true,      
    }
    //console.log(payload.id);
      
    await user.updateOne({ _id: user._id,last_login : Date.now() ,status_login: true });
      
    

    const token = jwt.sign(payload, "Random", { expiresIn: "1d" });
    res.status(200).send({
      success: true,
      message: "Logged in successfully!",
      token: "Bearer " + token })
  }catch (error) {
    res.status(400).send("An error login");
  }
  


});
  
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).send({
        success: true,
        user: {
            id: req.user._id,
            
        }
    })
});

router.get('/logout', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    await UserModel.updateOne({ _id: req.user._id, status_login: false });
    res.send("ok")


  }catch (error) {
    res.status(400).send("An error logout");
  }
  
  
});




module.exports = router;