const express = require("express");
const router = express.Router()

const postModel = require("../schemas/modelpost");
const post_to_sendModel = require("../schemas/model_post_tosend");
const userModel = require("../schemas/modeluser");
const commentModel = require("../schemas/modelcomment");
const catagoryModel = require("../schemas/modelcatagory");
const topicModel = require("../schemas/modeltopic");

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

routegit commit -am "commit message"r.post("/create_topic", async (request, response) => {
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

module.exports = router;