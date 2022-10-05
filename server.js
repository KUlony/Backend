const express = require("express");
const mongoose = require("mongoose");
const userroute = require("./routers/user")
const postroute = require("./routers/post")
const commentroute = require("./routers/comment")
const replyroute = require("./routers/reply")
const topic_cataroute = require("./routers/topic_cata")
const searchroute = require("./routers/search")
const searchtopicroute = require("./routers/searchtopic")

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
db.on("error", err => {
  console.log("Connection Error: " + err)
});

app.use("/api/user", userroute)
app.use("/api/post", postroute)
app.use("/api/commment", commentroute)
app.use("/api/reply", replyroute)
app.use("/api/topic", topic_cataroute)
app.use("/api/search", searchroute)
app.use("/api/searchtopic", searchtopicroute)


app.listen(4000, () => {
  console.log("Server is running at port 4000");
});

//npx nodemon server.js
