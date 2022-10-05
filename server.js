const express = require("express");
const mongoose = require("mongoose");
const userroute = require("./routers/user")
const postroute = require("./routers/post")
const commentroute = require("./routers/comment")
const replyroute = require("./routers/reply")
const topic_cataroute = require("./routers/topic_cata")
const searchroute = require("./routers/search")
const adminroute = require("./routers/admin")
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const { forwardAuthenticated,ensureAuthenticated } = require('./config/auth');

// Passport Config
require('./config/passport')(passport);

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

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use("/api/user", userroute)
app.use("/api/post",postroute)
app.use("/api/commment",commentroute)
app.use("/api/reply",replyroute)
app.use("/api/topic", topic_cataroute)
app.use("/api/search",searchroute)
app.use("/api/admin",adminroute)
// รอให้เสดทุกอย่างก่อน
// app.use("/api/post",ensureAuthenticated,postroute)
// app.use("/api/commment", ensureAuthenticated,commentroute)
// app.use("/api/reply", ensureAuthenticated,replyroute)
// app.use("/api/topic",ensureAuthenticated, topic_cataroute)
// app.use("/api/search", ensureAuthenticated,searchroute)


app.listen(4000, () => {
  console.log("Server is running at port 4000");
});

//npx nodemon server.js
