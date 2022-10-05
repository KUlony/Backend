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

router.get("/get_all_topic", async (request, response) => {
    const topic = await topicModel.find({});
    try {
      response.send(topic);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/get_all_catagory", async (request, response) => {
    const catagory = await catagoryModel.find({});
  
    try {
      response.send(catagory);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.post("/create_topic", async (request, response) => {
    const topic = new topicModel(request.body);
  
    try {
      await topic.save();
      response.send(topic);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.post("/create_catagory", async (request, response) => {
    const catagory = new catagoryModel(request.body);
  
    try {
      await catagory.save();
      response.send(catagory);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.post("/request_topic", async (request, response) => {
  const request_topic = new requesttopicModel({
    user_id : user_id_mock,
    catagory_id : request.body.catagory_id,
    request_topic : request.body.request_topic,
    request_time : Date.now()
  });
  try {
    await request_topic.save();
    response.send("success");
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;