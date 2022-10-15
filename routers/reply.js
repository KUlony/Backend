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

router.post("/create",async (request, response) => {
    // #swagger.tags = ['Reply']
    // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
    const reply = new replyModel({
      user_id : request.user.id,
      comment_id : request.body.comment_id,
      reply_content : request.body.reply_content,
    });
    try {
      await reply.save();
      response.send(reply);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/:comment_id", async (request, response) => {
  // #swagger.tags = ['Reply']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
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
      reply_content :reply[i].reply_content,
      reply_like_count : reply[i].reply_like_count,
      reply_time : reply[i].reply_time,
    };
    res.push(to_res);
  }
  try {
    response.send(res);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/:entity_id/report", async (request, response) => {
  // #swagger.tags = ['Reply']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  const post = new reportpostModel({
    user_id : user_id_mock,
    entity_id : request.params.entity_id,
    entity_type : "reply",
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

router.put("/:reply_id/edit", async (request, response) => {
  // #swagger.tags = ['Reply']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
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
  try {
    await newreply.save();
    await replyModel.findByIdAndUpdate(request.params.reply_id,request.body)
    response.send("finish");
  } catch (error) {
    response.status(500).send(error);
  }
});

router.put("/like/:reply_id", async (request, response) => {
  // #swagger.tags = ['Reply']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  try {
    const reply = await replyModel.findById(request.params.reply_id);
    var check = 0;
    check = check + reply.reply_like_count + 1
    await replyModel.findOneAndUpdate({_id : request.params.reply_id},{reply_like_count : check})
    response.send("liked");
  } catch (error) {
    response.status(500).send(error);
  }
});

router.put("/unlike/:reply_id", async (request, response) => {
  // #swagger.tags = ['Reply']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  try {
    const reply = await replyModel.findById(request.params.reply_id);
    var check = 0;
    check = check + reply.reply_like_count - 1
    await replyModel.findOneAndUpdate({_id : request.params.reply_id},{reply_like_count : check})
    response.send("unliked");
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;