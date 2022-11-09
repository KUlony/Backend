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
const { updateOne } = require("../schemas/modelotp");

router.post("/register/email", async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'ใช้สมัคร User ใหม่โดยจะส่ง OTP ยืนยันไปทาง Email'
  /* #swagger.security = [{
  }] */
  try {
    
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({
        success: false,
        message: "An account with this email already exists!"
      })
    }
    if(req.body.password === "" || req.confirm_password === "") {
      return res.status(400).send({
        success: false,
        message: "Please enter your password"
      });
    }
    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).send({
        success: false,
        message: "Passwords do NOT match, please try again."
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const OTP = Math.floor(100000 + Math.random()*900000);
    const message = OTP.toString()
    await sendEmail(req.body.email, "Verify Email", message);
    await UserModel({
      email:  req.body.email ,
      password :  hashedPassword
    }).save();
    
    
    console.log(OTP);
    await Otp({
      email:  req.body.email ,
      otp:OTP.toString()
    }).save();
    
    
    return res.status(200).send({
      success: true,
      message: "An Email sent to your account please verify",
      
    })
    //new
      
  } catch (e) {
    res.status(500).send({ message: e.message });
 }
  
});

router.post("/register/email/checkOTP", async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'สำหรับใช้เช็ค OTP'
  /* #swagger.security = [{
  }] */
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) { 
        return res.status(400).send({
          success: false,
          message: "No account associated with the email address."
        });
      }
      const otp = await Otp.findOne({email: req.body.email});
      if (!otp) {
        return res.status(400).send({
          success: false,
          message: "No account associated with the OTP address."
        });
      }
      if (otp.otp !== req.body.otp) {
        return res.status(400).send({
          success: false,
          message: "OTP do NOT match, please try again."
        });
      }
      if (otp.otp === req.body.otp ) {
        await user.updateOne({  verified: true });
      };

      await Otp.findByIdAndRemove(otp._id);
      
      return res.status(200).send({
        success: true,
        message: "Email verified sucessfully",
        
      })
    } catch (e) {
      res.status(500).send({ message: e.message });
   }
});

router.post('/login',async (req, res) => {
  // #swagger.tags = ['Login/Logout']
  // #swagger.description = 'ใช้เพื่อ Login'
  /* #swagger.security = [{
  }] */
  try {
    const user =  await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).send({
          success: false,
          message: "No account associated with the email address"
      })
    }
    if (!user.verified) {
      return res.status(401).send({
        success: false,
        message: "Verify email againt"
    })
    }
    // Incorrect password
    if (!compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        success: false,
        message: "Passwords do NOT match, please try again."
      })
    }
    else {
      const payload = {
      email: user.email,
      id: user._id,
      verified : true,      
      }
      //console.log(payload.id);
      await user.updateOne({ _id: user._id,last_login : Date.now() ,status_login: true });
      const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });
      return res.status(200).send({
        success: true,
        message: "Logged in successfully!",
        token: "Bearer " + token ,
        user_id : user._id,
        admin : user.admin
      })
    }
    } catch (e) {
      res.status(500).send({ message: e.message });
   }
});
  
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  // #swagger.ignore = true
  return res.status(200).send({
      success: true,
      user: {
          id: req.user._id,
          
      }
  })
});

router.get('/logout', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // #swagger.tags = ['Login/Logout']
  // #swagger.description = 'ใช้ Logout'
  try {
    const user = await UserModel.findOne({ _id: req.user.id });
    await user.updateOne({status_login : false})
    res.status(200).send({
      success: true,
      message: "Logged out successfully!",
      
    })
  }catch (e) {
    res.status(500).send({ message: e.message });
 }
});

router.post('/forgotpassword',async (req,res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'ส่งคำขอลืมรหัสผ่าน'
  try {
    const user =  await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).send({
          success: false,
          message: "No account associated with the email address."
      })
    }
    const OTP = Math.floor(100000 + Math.random()*900000)
    const message = OTP.toString()
    await sendEmail(req.body.email, "Verify your identity ", message);
    console.log(OTP)
    await new Otp({
      email: req.body.email,
      otp:OTP.toString()
    }).save();
    
    
    return res.status(200).send({
      success: true,
      message: "An Email sent to your account please verify your identity",
      
    })

  }
  catch (e) {
    res.status(500).send({ message: e.message });
 }
});

router.post("/forgotpassword/checkOTP", async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'ยืนยัน OTP เพื่อขอเปลี่ยนหัสผ่าน'
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({
      success: false,
      message: "No account associated with the email address."
    });
    const otp = await Otp.findOne({email: req.body.email});
    if (!otp) return res.status(400).send({
      success: false,
      message: "No account associated with the otp address."
    });
    if (otp.otp !== req.body.otp ) return res.status(400).send({
      success: false,
      message: "OTP do NOT match, please try again."
    });
    if (otp.otp === req.body.otp ) {
      await Otp.findByIdAndRemove(otp._id);
      await user.updateOne({verified_resetpassword : true})
      
      return res.status(200).send({
        success: true,
        message: "Verify your identity sucessfully",
        
      })
    };
    
  } catch (e) {
    res.status(500).send({ message: e.message });
 }
});

router.post("/forgotpassword/resetpassword",async(req,res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'เปลี่ยนรหัสผ่านเพราะลืมหัสผ่านเก่า'
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({
      success: false,
      message: "No account associated with the email address."
  });
    if (!user.verified_resetpassword) return res.status(400).send({
      success: false,
      message: "No Verify your identity."
  });
    if(req.body.password === "" || req.confirm_password === "") return res.status(400).send({
      success: false,
      message: "Please enter your password"
  });
    
    if (req.body.password !== req.body.confirm_password) return res.status(400).send({
      success: false,
      message: "Passwords do NOT match, please try again."
  });
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    await user.updateOne({ password: hashedPassword ,verified_resetpassword : false});
    
    return res.status(200).send({
      success: true,
      message: "Reset password sucessfully",
      
    })

    
  } catch (e) {
    res.status(500).send({ message: e.message });
 }
});

router.post("/changepassword" ,passport.authenticate('jwt', { session: false }), async(req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'ขอเปลี่ยนรหัสผ่าน'
  try {
    const user = await UserModel.findOne({ _id: req.user.id });
    if (!compareSync(req.body.currentpassword, user.password) ) {
      return res.status(400).send({
        success: false,
        message: "Currentpasswords do NOT match, please try again."
      })
    }
    
    if (req.body.newpassword !== req.body.confirm_newpassword) return res.status(400).send({
      success: false,
      message: "Newpasswords do NOT match, please try again."
    });
    const hashedPassword = await bcrypt.hash(req.body.newpassword,10);
    await user.updateOne({ password: hashedPassword });
   
    return res.status(200).send({
      success: true,
      message: "Change password sucessfully"
      
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
 }
});


router.post("/newotp/verify/email",async(req,res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'ขอ OTP สำหรับยืนยัน email ใหม่'
  try {
    const OTP = Math.floor(100000 + Math.random()*900000)
    const otp = await Otp.findOne({ email: req.body.email });
    if (!otp) return res.status(400).send({
      success: false,
      message: "Haven't requested OTP yet."
    });
    await otp.updateOne({otp :OTP.toString()})
    console.log(OTP)
    const message = OTP.toString()
    await sendEmail(req.body.email, "Verify your Email ", message);
    
    return res.status(200).send({
      success: true,
      message: "An Email sent to your account please verify email"
      
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
 }

});

router.post("/newotp/verify/forgotpassword",async(req,res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'ขอ OTP สำหรับยืนยัน Email เพื่อเปลี่ยนรหัสใหม่'
  try {
    const OTP = Math.floor(100000 + Math.random()*900000)
    const otp = await Otp.findOne({ email: req.body.email });
    if (!otp) return res.status(400).send({
      success: false,
      message: "Haven't requested OTP yet."
    });
    await otp.updateOne({otp :OTP.toString()})
    console.log(OTP)
    const message = OTP.toString()
    await sendEmail(req.body.email, "Verify your Email ", message);
   
    return res.status(200).send({
      success: true,
      message: "An Email sent to your account please verify email"
      
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
 }
});




module.exports = router;