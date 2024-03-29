const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userroute = require("./routers/user");
const postroute = require("./routers/post");
const commentroute = require("./routers/comment");
const replyroute = require("./routers/reply");
const topic_cataroute = require("./routers/topic_cata");
const searchroute = require("./routers/search");
const adminroute = require("./routers/admin");
const searchtopicroute = require("./routers/searchtopic");
const sing_uproute = require("./routers/sing-up");
const notificationroute = require("./routers/notification");
const homeroute = require("./routers/home");
const session = require("express-session");
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });
require("./config/passport");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

var dotenv = require("dotenv");
dotenv.config();
const database = process.env.MONGOLAB_URI;
const port = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

mongoose
   .connect(database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log("MongoDB Connected");
   })
   .catch((err) => {
      console.log("MongoDB not Connected" + err);
   });
const db = mongoose.connection;
db.on("error", (err) => {
   console.log("Connection Error: " + err);
});

app.get("/", function (req, res) {
   // #swagger.ignore = true
   res.redirect("/doc");
});
app.use("/api/sing-up", sing_uproute);
app.use("/api/user", auth, userroute);
app.use("/api/searchtopic", auth, searchtopicroute);
app.use("/api/post", auth, postroute);
app.use("/api/comment", auth, commentroute);
app.use("/api/reply", auth, replyroute);
app.use("/api/topic", auth, topic_cataroute);
app.use("/api/search", auth, searchroute);
app.use("/api/admin", auth, adminroute);
app.use("/api/notification", auth, notificationroute);
app.use("/api/home", auth, homeroute);

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.listen(port, () => {
   console.log(`Server is running at port ${port}`);
});

//npx nodemon server.js
