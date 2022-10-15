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

router.post("/create",async (request, response) => {
  // #swagger.tags = ['Comment']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  try {
    const comment = new commentModel({
      user_id : request.user.id,
      post_id : request.body.post_id,
      comment_content : request.body.comment_content,
    });
      await comment.save();
      const post = postModel.findById(request.body.post_id)
      const notice = new noticeModel({
        entity_user_id: post.user_id,
        entity_id: request.body.post_id,
        action_user_id: request.user.id,
        notice_type: "comment"
      })
      await notice.save();
      response.send(comment);
    } catch (e) {
      response.status(500).send({ message: e.message });
   }
});

router.get("/:post_id", async (request, response) => {
  // #swagger.tags = ['Comment']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  try {
  const comment = await commentModel.find({post_id : request.params.post_id,comment_status : "visible"});
  const res = [];
  for (i=0;i<comment.length;i++){
    const user = await userModel.findById(comment[i].user_id);
    const reply = await replyModel.find({comment_id : comment[i]._id});
    const to_res = {
      author : {
        user_id : user._id,
        username : user.user_name,
        profile_pic_url : user.profile_pic_url,
      },
      comment_content :comment[i].comment_content,
      comment_like_count : comment[i].comment_like_count,
      comment_reply_count : reply.length,
      comment_time : comment[i].comment_time,
    };
    res.push(to_res);
  }
    response.send(res);
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.post("/:entity_id/report", async (request, response) => {
  // #swagger.tags = ['Comment']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  try {
  const post = new reportpostModel({
    user_id : request.user.id,
    entity_id : request.params.entity_id,
    entity_type : "comment",
    report_type : request.body.report_type,
    report_time : Date.now()
  });
    await post.save();
    response.send(post);
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.put("/:comment_id/edit", async (request, response) => {
  // #swagger.tags = ['Comment']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  const oldcomment = await commentModel.findById(request.params.comment_id);
  const newcomment = new commentModel({
    user_id : oldcomment.user_id,
    post_id : oldcomment.post_id,
    comment_content : oldcomment.comment_content,
    comment_like_count : oldcomment.comment_like_count,
    comment_time : oldcomment.comment_time,
    comment_status : "edited",
    comment_delete_time : Date.now()
  });
  try {
    await newcomment.save();
    await commentModel.findByIdAndUpdate(request.params.comment_id,request.body)
    response.send("finish");
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.put("/like/:comment_id", async (request, response) => {
  // #swagger.tags = ['Comment']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  try {
    const comment = await commentModel.findById(request.params.comment_id);
    var check = 0;
    check = check + comment.comment_like_count + 1
    await commentModel.findOneAndUpdate({_id : request.params.comment_id},{comment_like_count : check})
    response.send("liked");
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.put("/unlike/:comment_id", async (request, response) => {
  // #swagger.tags = ['Comment']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  try {
    const comment = await commentModel.findById(request.params.comment_id);
    var check = 0;
    check = check + comment.comment_like_count - 1
    await commentModel.findOneAndUpdate({_id : request.params.comment_id},{comment_like_count : check})
    response.send("unliked");
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

module.exports = router;