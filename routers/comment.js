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
    // #swagger.tags = ['Post']
    // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
    const comment = new commentModel({
      user_id : request.user.id,
      post_id : request.body.post_id,
      comment_content : request.body.comment_content,
    });
    try {
      await comment.save();
      response.send(comment);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/:post_id", async (request, response) => {
  // #swagger.tags = ['Post']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
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

router.put("/:comment_id/edit", async (request, response) => {
  // #swagger.tags = ['Post']
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
  } catch (error) {
    response.status(500).send(error);
  }
});

router.put("/like/:comment_id", async (request, response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  try {
    const comment = await commentModel.findById(request.params.comment_id);
    var check = 0;
    check = check + comment.comment_like_count + 1
    await commentModel.findOneAndUpdate({_id : request.params.comment_id},{comment_like_count : check})
    response.send("liked");
  } catch (error) {
    response.status(500).send(error);
  }
});

router.put("/unlike/:comment_id", async (request, response) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  try {
    const comment = await commentModel.findById(request.params.comment_id);
    var check = 0;
    check = check + comment.comment_like_count - 1
    await commentModel.findOneAndUpdate({_id : request.params.comment_id},{comment_like_count : check})
    response.send("unliked");
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;