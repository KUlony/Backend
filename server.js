const express = require("express");
const mongoose = require("mongoose");
const userroute = require("./routers/user")
const postroute = require("./routers/post")
const commentroute = require("./routers/comment")
const replyroute = require("./routers/reply")
const topic_cataroute = require("./routers/topic_cata")

var dotenv = require("dotenv");
dotenv.config();
const database = process.env.MONGOLAB_URI;

const app = express();

app.use(express.json());

mongoose.connect(database, {
useNewUrlParser: true, 
useUnifiedTopology: true 
}).then(()=>{
  console.log("MongoDB Connected")    
}).catch(err=>{
  console.log("MongoDB not Connected" + err)
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use("/api/user", userroute)
app.use("/api/post", postroute)
app.use("/api/commment", commentroute)
app.use("/api/reply", replyroute)
app.use("/api/topic", topic_cataroute)

app.listen(4000, () => {
  console.log("Server is running at port 4000");
});

//npx nodemon server.js
