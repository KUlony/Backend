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
  // #swagger.description = 'สร้าง Comment โดยส่ง User_id ของคนคอมเม้น Post_id ของโพสที่จะคอมเม้นและ Comment_content'
  try {
    const comment = new commentModel({
      user_id : request.user.id,
      post_id : request.body.post_id,
      comment_content : request.body.comment_content,
      comment_time : Date.now()
    });
    await comment.save();
    const to_send = await commentModel.findOne(comment)
    const post = await postModel.findById(request.body.post_id)
    const notice = new noticeModel({
      entity_user_id: post.user_id,
      entity_id: request.body.post_id,
      action_user_id: request.user.id,
      notice_type: "comment"
    })
    await notice.save();
    response.send(to_send);
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});

router.get("/get_post_parent/:comment_id", async (req,res) => {
  // #swagger.tags = ['Topic/Catagory']
  // #swagger.description = 'ส่ง Comment ID เพื่อรับ Post id ที่ comment นั้นอยู่ นั้น'
  try {
    const comment = await commentModel.findById(req.params.comment_id)
    if (comment) res.send(comment.post_id)
    else {res.send({message: "comment id not found"})}
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
})

router.get("/:post_id", async (request, response) => {
  // #swagger.tags = ['Comment']
  // #swagger.description = 'ขอข้อมูลของ Comment ทั้งหมดของ post_id นั้น'
  try {
    const comment = await commentModel.find({post_id : request.params.post_id,comment_status : "visible"});
  const res = [];
  for (i=0;i<comment.length;i++){
    const user = await userModel.findById(comment[i].user_id);
    const reply = await replyModel.find({comment_id : comment[i]._id,reply_status : "visible"});
    const to_res = {
      author : {
        user_id : user._id,
        username : user.user_name,
        profile_pic_url : user.profile_pic_url,
      },
      comment_id: comment[i]._id,
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
  // #swagger.description = 'ส่ง Report comment'
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
  // #swagger.description = 'แก้ไข Comment'
  try {
    const comment = await commentModel.findById(request.params.comment_id);
    let check = String(comment.user_id)
    if (check !== request.user.id) {
      response.status(500).send("not your comment");
    }
    else {
      const oldcomment = await commentModel.findById(request.params.comment_id);
      const newcomment = new commentModel({
        user_id : oldcomment.user_id,
        post_id : oldcomment.post_id,
        comment_content : oldcomment.comment_content,
        comment_like_count : oldcomment.comment_like_count,
        comment_time : oldcomment.comment_time,
        comment_status : "edited",
        comment_delete_time : Date.now(),
        comment_before_edit_id : request.params.comment_id
      });
      await newcomment.save();
      await commentModel.findByIdAndUpdate(request.params.comment_id,request.body)
      response.send("finish");
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
 }
});

router.put("/:comment_id/delete", async (request, response) => {
  // #swagger.tags = ['Comment']
  // #swagger.description = 'ลบ comment นั้น'
  try {
    const comment = await commentModel.findById(request.params.comment_id);
    let check = String(comment.user_id)
    if (check !== request.user.id) {
      response.status(500).send("not your comment");
    }
    else{
      await commentModel.findOneAndUpdate({_id : request.params.comment_id},{comment_status : "deleted"})
      await replyModel.updateMany({comment_id : request.params.comment_id},{reply_status : "deleted"})
      response.send("deleted");
    }
  } catch (error) {
    response.status(500).send(error);
  }
});


module.exports = router;