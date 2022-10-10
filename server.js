const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const userroute = require("./routers/user")
const postroute = require("./routers/post")
const commentroute = require("./routers/comment")
const replyroute = require("./routers/reply")
const topic_cataroute = require("./routers/topic_cata")
const searchroute = require("./routers/search")
const searchtopicroute = require("./routers/searchtopic")
const sing_uproute = require("./routers/sing-up")


// const expressLayouts = require('express-ejs-layouts');
// const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false })

// Passport Config
// require('./config/authenticate')

require('./config/passport')
var dotenv = require("dotenv");
dotenv.config();
const database = process.env.MONGOLAB_URI;

const app = express()
app.use(express.json())
app.use(cors())

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
// app.use(expressLayouts);
// app.set('view engine', 'ejs');

// Express body parser
// app.use(express.urlencoded({ extended: true }));

// Express session
// app.use(
//   session({
//     secret: '12345-67890-09876-54321',
//     resave: true,
//     saveUninitialized: true
//   })
// );
// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// Connect flash
// app.use(flash());

// Global variables
// app.use(function(req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   next();
// });

app.use("/api/user",auth, userroute)
app.use("/api/sing-up", sing_uproute)
app.use("/api/searchtopic",auth, searchtopicroute)
app.use("/api/post",auth,postroute)
app.use("/api/commment",auth,commentroute)
app.use("/api/reply",auth,replyroute)
app.use("/api/topic",auth, topic_cataroute)
app.use("/api/search",auth,searchroute)


app.listen(4000, () => {
  console.log("Server is running at port 4000");
});

//npx nodemon server.js
