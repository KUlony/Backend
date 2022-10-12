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
const reportpostModel = require("../schemas/model_report_post");
const requesttopicModel = require("../schemas/model_request_topic");

router.put("/edit_profile",async (request, response) => {
    
    try {
      const user = await userModel.findOne({_id:request.user.id})
      
      await user.updateOne(request.body);
      response.status(200).send("ok");
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/:user_id/profile", async (request, response) => {
    const user = await userModel.findById(request.params.user_id);
    console.log(user);
    const res = {
        username : user.username,
        user_firtname : user.user_firtname,
        user_lastname : user.user_lastname,
        user_bio : user.bio,
        ku_gen : user.ku_gen,
        profile_pic_url : user.profile_pic_url,
        faculty : user.faculty,
        department : user.department,
        campus : user.campus,
        gender : user.gender
    }
    try {
      response.send(res);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/following_topic", async (request, response) => {
    const all_topic = await topicModel.find();
    console.log(all_topic);
    //const user_follow_topic = await followtopicModel.findById(request.params.user_id);
    const res = [];
    for (i = 0; i < all_topic.length; i++){
      const user_follow = await followtopicModel.find({ user_id : request.user.id, topic_id : all_topic[i]._id});
      const to_res={};
      // console.log(i);
      if (user_follow.length === 0){
        to_res.topic_id = all_topic[i]._id
        to_res.topic_name = all_topic[i].topic_name
        to_res.user_follow_status = false
      } else{
        to_res.topic_id = all_topic[i]._id
        to_res.topic_name = all_topic[i].topic_name
        to_res.user_follow_status = true
      };
      console.log(to_res)
      res.push(to_res)
    }
    try {
      response.send(res);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.post("/follow_topic/:topic_id", async (request, response) => {
  const followtopic = new followtopicModel({
    user_id : request.user.id,
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

router.delete("/unfollow_topic/:topic_id", async (request, response) => {
  try {
    await followtopicModel.findOneAndRemove({user_id : request.user.id, topic_id : request.params.topic_id });
    response.send("unfollowed");
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get("/user_like_post", async (request, response) => {
  const like_post = await likepostModel.find({user_id : request.user.id});
  //console.log(like_post);
  
  const res = []
  for(i=0 ;i<like_post.length;i++){
    const post = await postModel.findById(like_post[i].post_id);
    const comment = await commentModel.find({post_id : like_post[i].post_id});
    const user = await userModel.findById(post.user_id)
    const to_res = {
      author : {
        user_id : post.user_id,
        username : user.user_name,
        profile_pic_url : user.profile_pic_url,
      },
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
  try {
    response.send(res);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get("/user_post", async (request, response) => {
  const post = await postModel.find({user_id : request.user.id});
  const user = await userModel.findById(request.user.id);
  const res = {
    author : {
      user_id : request.user.id,
      username : user.user_name,
      profile_pic_url : user.profile_pic_url,
    },
    post : []
  }
  for(i=0 ;i<post.length;i++){
    const comment = await commentModel.find({post_id : post[i]._id});
    var to = true;
    const user_like_sta = await likepostModel.find({user_id : request.params.user_id, post_id : post[i]._id})
    if (user_like_sta.length === 0){
      to = false
    };
    const to_res = {
      post_title : post[i].post_title,
      post_content : post[i].post_content,
      cover_photo_url : post[i].cover_photo_url,
      post_photo_url : post[i].post_photo_url,
      post_catagory : post[i].catagory_id,
      post_topic : post[i].catagory_id,
      post_like_count : post[i].post_like_count,
      post_comment_count : comment.length,
      post_time : post[i].post_time,
      user_like_status : to
    }
    res.post.push(to_res)
  }
  try {
    response.send(res);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/like_post/:post_id", async (request, response) => {
  const like_post = new likepostModel({
    user_id : request.user.id,
    post_id : request.params.post_id,
    like_time : Date.now()
  });
  try {
    await like_post.save();
    const post = await postModel.findById(request.params.post_id);
    var check = 0;
    check = check + post.post_like_count + 1
    await postModel.findOneAndUpdate({_id : request.params.post_id},{post_like_count : check})
    response.send("liked");
  } catch (error) {
    response.status(500).send(error);
  }
});

router.delete("/unlike_post/:post_id", async (request, response) => {
  try {
    await likepostModel.findOneAndRemove({user_id : request.user.id, post_id : request.params.post_id });
    const post = await postModel.findById(request.params.post_id);
    var check = 0;
    check = check + post.post_like_count - 1
    await postModel.findOneAndUpdate({_id : request.params.post_id},{post_like_count : check})
    response.send("unliked");
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;