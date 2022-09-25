const express = require("express");
const mongoose = require("mongoose");
const userroute = require("./routers/user")
const postroute = require("./routers/post")
const commentroute = require("./routers/comment")
const replyroute = require("./routers/reply")

var dotenv = require("dotenv");
dotenv.config();
const database = process.env.MONGOLAB_URI;

const app = express();

app.use(express.json());

mongoose.connect(database, {
useNewUrlParser: true, 
useUnifiedTopology: true 
}, err => {
if(err) throw err;
console.log('Connected to MongoDB!!!')
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use("/user", userroute)
app.use("/post", postroute)
app.use("/commment", commentroute)
app.use("/reply", replyroute)

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});

//npx nodemon server.js