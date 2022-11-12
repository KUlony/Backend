const express = require("express");
const router = express.Router()
const postModel = require("../schemas/modelpost");
const userModel = require("../schemas/modeluser");
const commentModel = require("../schemas/modelcomment");
const replyModel = require("../schemas/modelreply");
const catagoryModel = require("../schemas/modelcatagory");
const topicModel = require("../schemas/modeltopic");
const followtopicModel = require("../schemas/model_following_topic");
const likepostModel = require("../schemas/model_like_post");
const reportpostModel = require("../schemas/model_report_post");
const requesttopicModel = require("../schemas/model_request_topic");

router.put("/edit_profile",async (request, response) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'แก้ไข Profile'
    try {
      const user = await userModel.findOne({_id:request.user.id})
      
      await user.updateOne(request.body);
      response.status(200).send("ok");
    } catch (e) {
      response.status(500).send({ message: e.message });
   }
});

router.get("/:user_id/profile", async (request, response) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'ขอข้อมูล User profile'
    try {
    const user = await userModel.findById(request.params.user_id);
    console.log(user);
    const res = {
        user_name : user.user_name,
        user_firstname : user.user_firstname,
        user_lastname : user.user_lastname,
        user_bio : user.user_bio,
        education : user.education,
        contact : user.contact,
        profile_pic_url : user.profile_pic_url,
        gender : user.gender
    }
      response.send(res);
    } catch (e) {
      response.status(500).send({ message: e.message });
   }
});

router.get("/following_topic", async (request, response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'ขอ topic ที่ user follow ไว้'
  try {
  const all_topic = await topicModel.find();
  const res = [];
  const user_follow = new Set(await followtopicModel.find({ user_id : request.user.id}))
  for (i = 0; i < all_topic.length; i++){
    let follow = false
    if (user_follow.has(all_topic[i])) follow = true
    const to_res={
      topic_id : all_topic[i]._id,
      topic_name : all_topic[i].topic_name,
      user_follow_status : follow
    }
    res.push(to_res)
  }
    response.send(res);
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.post("/follow_topic", async (request, response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'ส่ง Topic ที่ user ต้องการ Follow'
  try {
    await followtopicModel.deleteMany({user_id : request.user.id})
    for(i=0;i<request.body.topic_id.length;i++){
      const followtopic = new followtopicModel({
        user_id : request.user.id,
        topic_id : request.body.topic_id[i],
        follow_time : Date.now()
      });
      //console.log(followtopic)
      await followtopic.save();
    }
    response.send("done");
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

// router.delete("/unfollow_topic/:topic_id", async (request, response) => {
//   // #swagger.tags = ['User']
//   // #swagger.description = 'Unfollow topic ที่ user follow ไว้'
//   try {
//     await followtopicModel.findOneAndRemove({user_id : request.user.id, topic_id : request.params.topic_id });
//     response.send("unfollowed");
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

router.get("/user_like_post", async (request, response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'ขอ post ที่ user like ไว้'
  try {
  const like_post = await likepostModel.find({user_id : request.user.id});
  //console.log(like_post);
  
  const res = []
  // console.log(like_post)
  for(i=0 ;i<like_post.length;i++){
    let post = await postModel.find({_id : like_post[i].post_id,status : "visible"});
    console.log(post)
    if(post.length == 0) continue;
    post = post[0]
    const comment = await commentModel.find({post_id : like_post[i].post_id,comment_status : "visible"});
    const user = await userModel.findById(post.user_id)
    const to_res = {
      author : {
        user_id : post.user_id,
        username : user.user_name,
        profile_pic_url : user.profile_pic_url,
      },
      post_id : post._id,
      post_title : post.post_title,
      post_content : post.post_content,
      cover_photo_url : post.cover_photo_url,
      post_photo_url : post.post_photo_url,
      post_catagory : post.catagory_id,
      post_topic : post.catagory_id,
      post_like_count : post.post_like_count,
      post_comment_count : comment.length,
      post_time : post.post_time,
      user_like_status : true
    }
    res.push(to_res)
  }
    response.send(res);
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.get("/mypost", async (request, response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'ขอ Post ที่ user เป็นคนเขียน'
  try {
  const post = await postModel.find({user_id : request.user.id, post_status : "visible"});
  

  const user = await userModel.findById(request.user.id);
  const res = {
    author : {
      
      user_id : request.user.id,
      username : user.user_name,
      profile_pic_url : user.profile_pic_url,
    },
    post : []
  }
  if (post.length === 0) {
    response.send(res)
  } else {
    for(i=0 ;i<post.length;i++){
      if (!post[i]._id) continue
      const comment = await commentModel.find({post_id : post[i]._id ,comment_status : "visible"});
      var to = true;
      const user_like_sta = await likepostModel.find({user_id : request.user.id, post_id : post[i]._id})
      if (user_like_sta.length === 0){
        to = false
      };
      const to_res = {
        post_id : post[i]._id,
        post_title : post[i].post_title,
        post_content : post[i].post_content,
        cover_photo_url : post[i].cover_photo_url,
        post_photo_url : post[i].post_photo_url,
        post_catagory : post[i].catagory_id,
        post_topic : post[i].topic_id,
        post_like_count : post[i].post_like_count,
        post_comment_count : comment.length,
        post_time : post[i].post_time,
        user_like_status : to
      }
      res.post.push(to_res)
    }
      response.send(res);
  }
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.get("/is_my_entity", async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'เช็คว่า Entity นั้นเป็นของเราหรือไม่'
  try {
    post = await postModel.findOne({_id: req.query.id, user_id: req.user.id})
    comment = await commentModel.findOne({_id: req.query.id, user_id: req.user.id})
    reply = await replyModel.findOne({_id: req.query.id, user_id: req.user.id})
    if (post || comment || reply){
      res.send(true)
    } else { res.send(false) }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
})

module.exports = router;
