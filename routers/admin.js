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
const requesttopicModel = require("../schemas/model_request_topic");

router.get("/get_all_request_topic", async (request, response) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'รับข้อมูล Request Topic ทั้งหมด'
    const user = await userModel.findById(request.user.id);
    if(!user.admin){response.status(500).send("not a admin");} 
    const request_topic = await requesttopicModel.find({});
    res = [];
    for(i=0;i<request_topic.length;i++){
        const author = await userModel.findById(request_topic[i].user_id);
        const to_res = {
            request_id : request_topic[i]._id,
            user_id : request_topic[i].user_id,
            user_name : author.user_name,
            profile_pic_url : author.profile_pic_url,
            request_topic : request_topic[i].request_topic,
            requset_time : request_topic[i].request_time
        }
        res.push(to_res)
    }
    try {
      response.send(res);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.delete("/remove_request_topic/:request_id", async (request, response) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'ลบ Request topic ออกจาก Database'
    const user = await userModel.findById(request.user.id);
    if(user.admin === "false"){response.status(500).send("not a admin");} 
    try {
        await requesttopicModel.findByIdAndRemove(request.params.request_id);
        response.send("success");
    } catch (error) {
        response.status(500).send(error);
    }
});

router.post("/accept_request_topic/:request_id", async (request, response) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'ตอบรับ Request topic โดยส่ง topic_name และ catagory_id ที่ต้องการเพิ่มใน Database จากนั้นทำการลบ Request ออกจาก Database'
    const user = await userModel.findById(request.user.id);
    if(user.admin === "false"){response.status(500).send("not a admin");} 
    const request_topic = await requesttopicModel.findById(request.params.request_id);
    const topic = new topicModel({
        catagory_id : request.body.catagory_id,
        topic_name : request.body.topic_name
    })
    try {
        await topic.save();
        await requesttopicModel.findByIdAndRemove(request.params.request_id);
        response.send("success");
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;