const express = require("express");
const router = express.Router()

const postModel = require("../schemas/modelpost");
const post_to_sendModel = require("../schemas/model_post_tosend");
const userModel = require("../schemas/modeluser");
const commentModel = require("../schemas/modelcomment");
const catagoryModel = require("../schemas/modelcatagory");
const topicModel = require("../schemas/modeltopic");
const followtopicModel = require("../schemas/model_following_topic");
const likepostModel = require("../schemas/model_like_post");
const reportpostModel = require("../schemas/model_report_post");
const requesttopicModel = require("../schemas/model_request_topic");

const user_id_mock = "6339dc63d112d2d4af136689";
const admin_id_mock = "633d8b6375345b76ae87824b";

router.get("/get_all_request_topic", async (request, response) => {
    const request_topic = await requesttopicModel.find({});
    res = [];
    for(i=0;i<request_topic.length;i++){
        const to_res = {
            request_id : request_topic[i]._id,
            user_id : request_topic[i].user_id,
            catagory_id : request_topic[i].catagory_id,
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

router.delete("/remove_request_topic", async (request, response) => {
    try {
        await requesttopicModel.findByIdAndRemove(request.body.request_id);
        response.send("success");
    } catch (error) {
        response.status(500).send(error);
    }
});

router.post("/accept_request_topic", async (request, response) => {
    const request_topic = await requesttopicModel.findById(request.body.request_id);
    const topic = new topicModel({
        catagory_id : request_topic.catagory_id,
        topic_name : request_topic.request_topic
    })
    try {
        await topic.save();
        await requesttopicModel.findByIdAndRemove(request.body.request_id);
        response.send("success");
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;