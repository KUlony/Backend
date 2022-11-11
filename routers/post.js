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
const noticeModel = require("../schemas/model_notification")

let posts_per_page = 5

router.post("/create",async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'ส่ง post ที่ต้องการเพิ่มใน Database'
  try {
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
      post_photo_url : request.body.post_photo_url,
      post_time : Date.now()
    });
  
      await post.save();
      response.send(post);
    } catch (e) {
      response.status(500).send({ message: e.message });
   }
});

router.get("/all_post", async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'ขอข้อมูล post ทั้งหมดจาก Database'
  try {
  if (!request.query.page){
    response.send("Please insert page parameter!!!")
  }
  else if (request.query.page < 1){
    response.send("Wrong page number")
  } else {
    const posts = await postModel.find({post_status : "visible"})
    .sort({"post_time": -1})
    .skip((request.query.page - 1)*posts_per_page)
    .limit(posts_per_page)
    //console.log(posts);
    const res = [];
    
    for (let i=0; i < posts.length;i++){
      //console.log("hi")
      var to_res = true
      const user = await userModel.findById(posts[i].user_id);
      const comment = await commentModel.find({post_id : posts[i]._id,comment_status : "visible"})
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
      response.send(res);
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
}
});

router.get("/:post_id", async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'ขอข้อมูลของ post_id นั้นๆ'
  try {
  const posts = await postModel.findById(request.params.post_id);
  if (!posts) { 
    response.send({ message: "post not found"})
    return
  }
  var to_res = true
  const user = await userModel.findById(posts.user_id);
  const comment = await commentModel.find({post_id : posts._id,comment_status : "visible"})
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
    const viewuser = await userModel.findById(request.user.id)
    if (!viewuser.visit_post.includes(request.params.post_id)) {
      if (viewuser.visit_post.length >= 5){
      viewuser.visit_post.pop()
    }
    viewuser.visit_post.unshift(request.params.post_id)
    await userModel.updateOne({_id: request.user.id},{visit_post: viewuser.visit_post})
  }
    response.send(res);
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.post("/:entity_id/report", async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'ส่ง Report post'
  try {
  const post = new reportpostModel({
    user_id : request.user.id,
    entity_id : request.params.entity_id,
    entity_type : "post",
    report_type : request.body.report_type,
    report_time : Date.now()
  });
    await post.save();
    response.send(post);
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.put("/:post_id/edit", async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'แก้ไข post'
  try {
    const post = await postModel.findById(request.params.post_id);
    let check = String(post.user_id)
    if (check !== request.user.id) {
      response.status(400).send("not your post");
    }
    else{
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
        post_delete_time : Date.now(),
        post_before_edit_id : request.params.post_id
      });
      await newpost.save();
      await postModel.findByIdAndUpdate(request.params.post_id,request.body)
      response.send("finish");
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.post("/like/:post_id", async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'Like post และส่ง notice ให้เจ้าของ Post'
  try {
    const check = await likepostModel.findOne({user_id : request.user.id, post_id : request.params.post_id})
    if (check){
      response.status(400).send("already liked");
    }
    else{
      const like_post = new likepostModel({
        user_id : request.user.id,
        post_id : request.params.post_id,
        like_time : Date.now()
      });
      await like_post.save();
      const post = await postModel.findById(request.params.post_id);
      const like_post_count = await likepostModel.find({post_id : request.params.post_id})
      const notice = new noticeModel({
        entity_user_id: post.user_id,
        entity_id: request.params.post_id,
        action_user_id: request.user.id,
        notice_type: "like"
      })
      await notice.save();
      await postModel.findOneAndUpdate({_id : request.params.post_id},{post_like_count : like_post_count.length})
      response.send("liked");
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.delete("/unlike/:post_id", async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'Unlike post และลบ Notice ออก'
  try {
    const check = await likepostModel.findOne({user_id : request.user.id, post_id : request.params.post_id})
    if (!check){
      response.status(400).send("not liked yet");
    }
    else {
      await likepostModel.findOneAndRemove({user_id : request.user.id, post_id : request.params.post_id });
      await noticeModel.findOneAndRemove({post_id: request.params.post_id, action_user_id: request.user.id })
      const like_post_count = await likepostModel.find({post_id : request.params.post_id})
      await postModel.findOneAndUpdate({_id : request.params.post_id},{post_like_count : like_post_count.length})
      response.send("unliked");
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.put("/:post_id/delete", async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'ลบ post นั้น'
  try {
    const post = await postModel.findById(request.params.post_id);
    let check = String(post.user_id)
    if (check !== request.user.id) {
      response.status(400).send("not your post");
    }
    else{
      await postModel.findOneAndUpdate({_id : request.params.post_id},{post_status : "deleted"})
      const comment = await commentModel.find({post_id : request.params.post_id})
      await commentModel.updateMany({post_id : request.params},{comment_status : "deleted"})
      for(i=0;i<comment.length;i++){
        await replyModel.updateMany({comment_id : comment[i]._id},{reply_status : "deleted"})
      }
      response.send("deleted");
    };
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});

module.exports = router;