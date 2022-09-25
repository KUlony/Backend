const express = require("express");
const router = express.Router()

const postModel = require("../schemas/modelpost");

router.post("/post/create", async (request, response) => {
    const post = new postModel(request.body);
  
    try {
      await post.save();
      response.send(post);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/posts", async (request, response) => {
  const posts = await postModel.find({});

  try {
    response.send(posts);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;