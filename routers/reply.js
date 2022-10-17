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
    // #swagger.tags = ['Reply']
    // #swagger.description = 'ส่งข้อมูลสำหรับสร้าง Reply'
    try {
    const reply = new replyModel({
      user_id : request.user.id,
      comment_id : request.body.comment_id,
      reply_content : request.body.reply_content,
    });
      await reply.save();
      const to_send = await replyModel.findOne(reply)
      const comment = postModel.findById(request.body.comment_id)
      const notice = new noticeModel({
        entity_user_id: comment.user_id,
        entity_id: request.body.post_id,
        action_user_id: request.user.id,
        notice_type: "reply"
      })
      await notice.save();
      response.send(to_send);
    } catch (e) {
      response.status(500).send({ message: e.message });
   }
});

router.get("/:comment_id", async (request, response) => {
  // #swagger.tags = ['Reply']
  // #swagger.description = 'ขอ reply ทั้งหมดของ Comment นั้น'
  try {
  const reply = await replyModel.find({comment_id : request.params.comment_id,reply_status : "visible"});
  const res = [];
  for (i=0;i<reply.length;i++){
    const user = await userModel.findById(reply[i].user_id);
    const to_res = {
      author : {
        user_id : user._id,
        username : user.user_name,
        profile_pic_url : user.profile_pic_url,
      },
      reply_id: reply[i]._id,
      reply_content :reply[i].reply_content,
      reply_like_count : reply[i].reply_like_count,
      reply_time : reply[i].reply_time,
    };
    res.push(to_res);
  }
    response.send(res);
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.post("/:entity_id/report", async (request, response) => {
  // #swagger.tags = ['Reply']
  // #swagger.description = 'ส่ง report Reply'
  try {
  const post = new reportpostModel({
    user_id : request.user.id,
    entity_id : request.params.entity_id,
    entity_type : "reply",
    report_type : request.body.report_type,
    report_time : Date.now()
  });
    await post.save();
    response.send(post);
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.put("/:reply_id/edit", async (request, response) => {
  // #swagger.tags = ['Reply']
  // #swagger.description = 'แก้ไข Reply'
  try {
    const reply = await replyModel.findById(request.params.reply_id);
    let check = String(reply.user_id)
    if (check !== request.user.id) {
      response.status(500).send("not your reply");
    }
    else {
      const oldreply = await replyModel.findById(request.params.reply_id);
      const newreply = new replyModel({
        user_id : oldreply.user_id,
        comment_id : oldreply.comment_id,
        reply_content : oldreply.reply_content,
        reply_like_count : oldreply.reply_like_count,
        reply_time : oldreply.reply_time,
        reply_status : "edited",
        reply_delete_time : Date.now()
      });
      await newreply.save();
      await replyModel.findByIdAndUpdate(request.params.reply_id,request.body)
      response.send("finish");
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.put("/:reply_id/delete", async (request, response) => {
  // #swagger.tags = ['Reply']
  // #swagger.description = 'ลบ reply นั้น'
  try {
    const reply = await replyModel.findById(request.params.reply_id);
    let check = String(reply.user_id)
    if (check !== request.user.id) {
      response.status(500).send("not your reply");
    }
    else{
      await replyModel.findOneAndUpdate({_id : request.params.reply_id},{reply_status : "deleted"})
      response.send("deleted");
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;