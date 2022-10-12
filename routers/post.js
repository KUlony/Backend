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
//const user_id_mock = "6345767f2b95ee9f9c0a663d";
const reportpostModel = require("../schemas/model_report_post");



router.post("/create",async (request, response) => {
    console.log(request.user.id);
    const post = new postModel({
      user_id : request.user.id,
      catagory_id : request.body.catagory_id,
      topic_id : request.body.topic_id,
      post_title : request.body.post_title,
      post_content : request.body.post_content,
      cover_photo_url : request.body.cover_photo_url,
      post_photo_url : request.body.post_photo_url
    });
  
    try {
      await post.save();
      response.send(post);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/all_post", async (request, response) => {
  const posts = await postModel.find({});
  //console.log(posts);
  const res = [];
  
  for (let i=0; i < posts.length;i++){
    //console.log("hi")
    var to_res = true
    const user = await userModel.findById(posts[i].user_id);
    const comment = await commentModel.find({post_id : posts[i]._id})
    //console.log(posts[i])
    //console.log(user)
    const user_like_sta = await likepostModel.find({user_id : user_id_mock, post_id : posts[i]._id})
    if (user_like_sta.length === 0){
      to_res = false
    };
    const a_post = new post_to_sendModel({
      author : {
        user_id : posts[i].user_id,
        username : user.user_name,
        profile_pic_url : user.profile_pic_url,
      },
      post_catagory : posts[i].catagory_id,
      post_topic : posts[i].catagory_id,
      post_title : posts[i].post_title,
      post_content :posts[i].post_content,
      cover_photo_url : posts[i].cover_photo_url,
      post_photo_url : posts[i].post_photo_url,
      post_like_count : posts[i].post_like_count,
      post_comment_count : comment.length,
      post_time : posts[i].post_time,
      user_like_status : to_res
    });
    res.push(a_post);
  }
  try {
    response.send(res);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/:entity_id/report", async (request, response) => {
  const post = new reportpostModel({
    user_id : user_id_mock,
    entity_id : request.params.entity_id,
    entity_type : "comment",
    report_type : request.body.report_type,
    report_time : Date.now()
  });
  try {
    await post.save();
    response.send(post);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;