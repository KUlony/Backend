const express = require("express");
const router = express.Router()

const commentModel = require("../schemas/modelcomment");

router.post("/create", async (request, response) => {
  const comment = new commentModel(request.body);

  try {
    await comment.save();
    response.send(comment);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get("/", async (request, response) => {
  const comments = await commentModel.find({});

  try {
    response.send(comments);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;