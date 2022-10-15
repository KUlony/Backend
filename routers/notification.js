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
   try{
      notices = await noticeModel
      .find({content_user_id: req.user.id})
      .limit(20)
      res.send(notices)
   } catch (e) {
      res.status(500).send({ message: e.message });
   }
})

router.get("/read/:notic_id", async (req,res) => {
   try {
      await noticeModel.findByIdAndUpdate(req.params.notic_id, {readed: true})
      res.send("Readed")
   } catch (e) {
      res.status(500).send({ message: e.message });
   }
})

router.get("/unread/:notic_id", async (req,res) => {
   try {
      await noticeModel.findByIdAndUpdate(req.params.notic_id, {readed: false})
      res.send("Readed")
   } catch (e) {
      res.status(500).send({ message: e.message });
   }
})

module.exports = router