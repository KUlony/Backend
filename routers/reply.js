const express = require("express");
const router = express.Router()

const replyModel = require("../schemas/modelreply");

router.post("/create", async (request, response) => {
  // #swagger.tags = ['Reply']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  const reply = new replyModel(request.body);

  try {
    await reply.save();
    response.send(reply);
  } catch (error) {
    response.status(500).send(error);
  }
});
router.get("/", async (request, response) => {
  // #swagger.tags = ['Reply']
  // #swagger.description = 'ค้นหาโพสต์ด้วยข้อความ'
  const replys = await replyModel.find({});

  try {
    response.send(replys);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;