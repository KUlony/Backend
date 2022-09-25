const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Router = require("./routes")
var dotenv = require("dotenv");
dotenv.config();
const database = process.env.MONGOLAB_URI;

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

app.use(Router);

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});

//npx nodemon server.js