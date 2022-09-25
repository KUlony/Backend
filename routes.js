const express = require("express");
const userModel = require("./schemas/modeluser");
const postModel = require("./schemas/modelpost");
const commentModel = require("./schemas/modelcomment");
const replyModel = require("./schemas/modelreply");

const app = express();

app.post("/user/create", async (request, response) => {
    const user = new userModel(request.body);
  
    try {
      await user.save();
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
});
app.get("/users", async (request, response) => {
    const users = await userModel.find({});
  
    try {
      response.send(users);
    } catch (error) {
      response.status(500).send(error);
    }
});

app.post("/post/create", async (request, response) => {
    const post = new postModel(request.body);
  
    try {
      await post.save();
      response.send(post);
    } catch (error) {
      response.status(500).send(error);
    }
});
app.get("/posts", async (request, response) => {
  const posts = await postModel.find({});

  try {
    response.send(posts);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/reply/create", async (request, response) => {
  const reply = new replyModel(request.body);

  try {
    await reply.save();
    response.send(reply);
  } catch (error) {
    response.status(500).send(error);
  }
});
app.get("/replys", async (request, response) => {
  const replys = await replyModel.find({});

  try {
    response.send(replys);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/comment/create", async (request, response) => {
  const comment = new commentModel(request.body);

  try {
    await comment.save();
    response.send(comment);
  } catch (error) {
    response.status(500).send(error);
  }
});
app.get("/comments", async (request, response) => {
  const comments = await commentModel.find({});

  try {
    response.send(comments);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;