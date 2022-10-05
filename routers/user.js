const express = require("express");
const router = express.Router()
const postModel = require("../schemas/modelpost");
const post_to_sendModel = require("../schemas/model_post_tosend");
const userModel = require("../schemas/modeluser");
const commentModel = require("../schemas/modelcomment");
const catagoryModel = require("../schemas/modelcatagory");
const topicModel = require("../schemas/modeltopic");
const followtopicModel = require("../schemas/model_following_topic");
const likepostModel = require("../schemas/model_like_post");



const sendEmail = require("../config/email");
const Token = require("../schemas/token");
const Otp = require("../schemas/modelotp");
const { User, validate } = require("../schemas/modelsing-up");
const crypto = require("crypto");
const otpGenerator = require('otp-generator');
const Math = require('math');
const bcrypt = require('bcrypt')
const { forwardAuthenticated,ensureAuthenticated } = require('../config/auth');
const passport = require('passport');


const user_id_mock = "6339dc63d112d2d4af136689";


router.post("/create", async (request, response) => {
    const user = new userModel();
    try {
      await user.save();
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/get", async (request, response) => {
    const user = await userModel.findById("6329fedcc3479021a8d8d1e4");
    console.log(user)
    try {
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/:user_id/following_topic", async (request, response) => {
    const all_topic = await topicModel.find();
    //console.log(request.params.user_id);
    //const user_follow_topic = await followtopicModel.findById(request.params.user_id);
    const res = [];
    const to_res={};
    for (i = 0; i < all_topic.length; i++){
      const user_follow = await followtopicModel.find({ user_id : request.params.user_id, topic_id : all_topic[i]._id});
      console.log(user_follow);
      if (user_follow.length === 0){
        to_res.topic_id = all_topic[i]._id
        to_res.topic_name = all_topic[i].topic_name
        to_res.user_follow_status = false
      } else{
        to_res.topic_id = all_topic[i]._id
        to_res.topic_name = all_topic[i].topic_name
        to_res.user_follow_status = true
      };
      res.push(to_res)
      try {
        response.send(res);
      } catch (error) {
        response.status(500).send(error);
      }
    }
});

router.post("/:user_id/follow_topic/:topic_id", async (request, response) => {
  const followtopic = new followtopicModel({
    user_id : request.params.user_id,
    topic_id : request.params.topic_id,
    follow_time : Date.now()
  });
  try {
    await followtopic.save();
    response.send(followtopic);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.delete("/:user_id/unfollow_topic/:topic_id", async (request, response) => {
  try {
    await followtopicModel.findOneAndRemove({user_id : request.params.user_id, topic_id : request.params.topic_id });
    response.send("unfollowed");
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/:user_id/like_post/:post_id", async (request, response) => {
  const like_post = new likepostModel({
    user_id : request.params.user_id,
    post_id : request.params.post_id,
    like_time : Date.now()
  });
  try {
    await like_post.save();
    response.send(like_post);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.delete("/:user_id/unlike_post/:post_id", async (request, response) => {
  try {
    await likepostModel.findOneAndRemove({user_id : request.params.user_id, post_id : request.params.post_id });
    response.send("unliked");
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/register/email", async (req, res) => {
  
  try {
    // console.log(crypto.randomBytes(32).toString("hex"));
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    // if (user)
    //   return res.status(400).send("User with given email already exist!");

    const hashedPassword = await bcrypt.hash(req.body.password,10);
    user = await new User({
      // name: req.body.name,
      email: req.body.email,
      password : hashedPassword
    }).save();
    
    let token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex")
    }).save();

    

    
    const OTP = Math.floor(100000 + Math.random()*900000);
    console.log(OTP);
    
   
    let otp = await new Otp({
      userId: user._id,
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
    
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Not find email");

    const otp = await Otp.findOne({
      userId: user._id,
     
    });
    console.log(user._id)
    if (!otp) return res.status(400).send("Not find OTP");

    if (otp.otp == req.body.otp ) {
      await User.updateOne({ _id: user._id, verified: true });
    };

    
    await Otp.findByIdAndRemove(otp._id);

    res.send("email verified sucessfully");
  } catch (error) {
    res.status(400).send("An error occured");
  }
});

router.get('/login', (req, res) => res.send('login'));


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/api/user/dashboard',
    failureRedirect: '/api/user/login',
    failureFlash: true
  })(req, res, next);
});

// Logout


router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/api/user/login');
  });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  
  res.send('wellcome')
});


module.exports = router;