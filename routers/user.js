const express = require("express");
const router = express.Router()

const userModel = require("../schemas/modeluser");

const user_id_mock = "6329fedcc3479021a8d8d1e4";

router.post("/create", async (request, response) => {
    const user = new userModel();
    try {
      await user.save();
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/get/", async (request, response) => {
    const user = await userModel.findById("6329fedcc3479021a8d8d1e4");
    console.log(user)
    try {
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
});

module.exports = router;