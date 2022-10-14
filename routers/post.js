const express = require("express");
const router = express.Router()

const postModel = require("../schemas/modelpost");
const userModel = require("../schemas/modeluser");
const commentModel = require("../schemas/modelcomment");
const catagoryModel = require("../schemas/modelcatagory");
const topicModel = require("../schemas/modeltopic");
const followtopicModel = require("../schemas/model_following_topic");
const likepostModel = require("../schemas/model_like_post");
const reportpostModel = require("../schemas/model_report_post");

router.post("/create",async (request, response) => {
    // #swagger.tags = ['Post']
    // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
    const res = []
    const check = []
    for(i=0;i<request.body.topic_id.length;i++){
      const topic = await topicModel.findOne({ _id : request.body.topic_id[i]});
      let cata = topic.catagory_id;
      let to_check = String(cata);
      // console.log(res)
      // console.log(cata)
      // console.log(check.includes(to_check));
      if(!(check.includes(to_check))){
        res.push(topic.catagory_id);
        check.push(to_check);
      };
    }
    //console.log(res);
    const post = new postModel({
      user_id : request.user.id,
      catagory_id : res,
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
  // #swagger.tags = ['Post']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  const posts = await postModel.find({post_status : "visible"});
  //console.log(posts);
  const res = [];
  
  for (let i=0; i < posts.length;i++){
    //console.log("hi")
    var to_res = true
    const user = await userModel.findById(posts[i].user_id);
    const comment = await commentModel.find({post_id : posts[i]._id})
    //console.log(posts[i])
    //console.log(user)
    const user_like_sta = await likepostModel.find({user_id : request.user.id, post_id : posts[i]._id})
    if (user_like_sta.length === 0){
      to_res = false
    };
    const a_post = {
      author : {
        user_id : posts[i].user_id,
        username : user.user_name,
        profile_pic_url : user.profile_pic_url,
      },
      post_id : posts[i]._id,
      post_catagory : posts[i].catagory_id,
      post_topic : posts[i].topic_id,
      post_title : posts[i].post_title,
      post_content :posts[i].post_content,
      cover_photo_url : posts[i].cover_photo_url,
      post_photo_url : posts[i].post_photo_url,
      post_like_count : posts[i].post_like_count,
      post_comment_count : comment.length,
      post_time : posts[i].post_time,
      user_like_status : to_res
    };
    res.push(a_post);
  }
  try {
    response.send(res);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get("/:post_id", async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  const posts = await postModel.findById(request.params.post_id);
  var to_res = true
  const user = await userModel.findById(posts.user_id);
  const comment = await commentModel.find({post_id : posts._id})
  //console.log(posts[i])
  //console.log(user)
  const user_like_sta = await likepostModel.find({user_id : request.user.id, post_id : posts._id})
  if (user_like_sta.length === 0){
    to_res = false
  };
  const res = {
    author : {
      user_id : posts.user_id,
      username : user.user_name,
      profile_pic_url : user.profile_pic_url,
    },
    post_catagory : posts.catagory_id,
    post_topic : posts.topic_id,
    post_title : posts.post_title,
    post_content :posts.post_content,
    cover_photo_url : posts.cover_photo_url,
    post_photo_url : posts.post_photo_url,
    post_like_count : posts.post_like_count,
    post_comment_count : comment.length,
    post_time : posts.post_time,
    user_like_status : to_res
  };
  try {
    response.send(res);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/:entity_id/report", async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  const post = new reportpostModel({
    user_id : user_id_mock,
    entity_id : request.params.entity_id,
    entity_type : "post",
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

router.put("/:post_id/edit", async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  const oldpost = await postModel.findById(request.params.post_id);
  const newpost = new postModel({
    user_id : oldpost.user_id,
    catagory_id : oldpost.catagory_id,
    topic_id : oldpost.topic_id,
    post_title : oldpost.post_title,
    post_content : oldpost.post_content,
    cover_photo_url : oldpost.cover_photo_url,
    post_photo_url : oldpost.post_photo_url,
    post_like_count : oldpost.post_like_count,
    post_time : oldpost.post_time,
    post_status : "edited",
    post_delete_time : Date.now()
  });
  try {
    await newpost.save();
    await postModel.findByIdAndUpdate(request.params.post_id,request.body)
    response.send("finish");
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;