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

router.get("/get_all_topic", async (request, response) => {
    const topic = await topicModel.find({});
    const res = [];
    for (i=0;i<topic.length;i++){
      const to_res = {
        topic_id : topic[i]._id,
        catagory_id : topic[i].catagory_id,
        topic_name : topic[i].topic_name
      }
      res.push(to_res);
    }
    try {
      response.send(res);
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

router.get("/get_all_catagory_topic", async (request, response) => {
  const catagory = await catagoryModel.find({});
  const res = [];
  for (i=0;i<catagory.length;i++){
    const to_res = {
      catagory_id : catagory[i]._id,
      catagory_name : catagory[i].catagory_name,
      all_topic : []
    }
    const topic = await topicModel.find({catagory_id : catagory[i]._id});
    for(j=0;j<topic.length;j++){
      const to_res2 = {
        topic_id : topic[j]._id,
        topic_name : topic[j].topic_name
      }
      to_res.all_topic.push(to_res2);
    }
    res.push(to_res);
  }
  try {
    response.send(res);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/create_topic", async (request, response) => {
  const user = await userModel.findById(request.user.id);
  if(user.admin === "false"){response.status(500).send("not a admin");} 
  const topic = new topicModel(request.body);
  try {
    await topic.save();
    response.send(topic);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/request_topic", async (request, response) => {
  const user = await userModel.findById(request.user.id);
  if(user.admin === "false"){response.status(500).send("not a admin");} 
  const request_topic = new requesttopicModel({
    user_id : request.user.id,
    request_topic : request.query.topic,
    request_time : Date.now()
  });
  try {
    await request_topic.save();
    response.send("Request sended");
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;