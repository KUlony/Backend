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
const noticeModel = require("../schemas/model_notification")

router.get("/", async (req,res) => {
    // #swagger.tags = ['Notice']
    // #swagger.description = 'ข้อ notice ทั้งหมดของ user'
   try{
      const notices = await noticeModel
      .find({entity_user_id: req.user.id})
      .limit(20)
      const to_res = []
      for (i=0;i<notices.length;i++){
         const action_user = await userModel.findById(notices[i].action_user_id)
         const entity_user = await userModel.findById(notices[i].entity_user_id)
         const to_res2 = {
            action_user : {
               action_user_id : notices[i].action_user_id,
               action_user_name : action_user.user_name,
               action_user_pic : action_user.profile_pic_url
            },
            entity_id : notices[i].entity_id,
            notice_type : notices[i].notice_type,
            notice_time : notices[i].notice_time
         }
         to_res.push(to_res2)
      }
      res.send(to_res)
   } catch (e) {
      res.status(500).send({ message: e.message });
   }
})

router.post("/read/:notic_id", async (req,res) => {
    // #swagger.tags = ['Notice']
    // #swagger.description = 'เปลี่ยน status ของ notice เป็น readed : true'
   try {
      await noticeModel.findByIdAndUpdate(req.params.notic_id, {readed: true})
      res.send("Readed")
   } catch (e) {
      res.status(500).send({ message: e.message });
   }
})

router.post("/unread/:notic_id", async (req,res) => {
    // #swagger.tags = ['Notice']
    // #swagger.description = 'เปลี่ยน status ของ notice เป็น readed : false'
   try {
      await noticeModel.findByIdAndUpdate(req.params.notic_id, {readed: false})
      res.send("Readed")
   } catch (e) {
      res.status(500).send({ message: e.message });
   }
})

module.exports = router