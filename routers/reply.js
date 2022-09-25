const express = require("express");
const router = express.Router()

const replyModel = require("../schemas/modelreply");

router.post("/reply/create", async (request, response) => {
  const reply = new replyModel(request.body);

  try {
    await reply.save();
    response.send(reply);
  } catch (error) {
    response.status(500).send(error);
  }
});
router.get("/replys", async (request, response) => {
  const replys = await replyModel.find({});

  try {
    response.send(replys);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;