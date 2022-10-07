const express = require("express");
const router = express.Router()

const postModel = require("../schemas/modelpost");
const postSend = require("../schemas/model_post_tosend");
const userModel = require("../schemas/modeluser");
const commentModel = require("../schemas/modelcomment");
const likepostModel = require("../schemas/model_like_post");

const user_id_mock = "6339dc63d112d2d4af136689";
router.get("/post", async (req, res) => {
   try {
      let payload = [];
      if (req.query.text) {
         let posts = await postModel.aggregate([
            {
               $search: {
                  index: "searchPost",
                  compound: {
                     should: [
                        {
                           text: {
                              query: req.query.text,
                              path: "post_title",
                              fuzzy: {
                                 maxEdits: 2,
                              },
                              score: { "boost": { "value": 3} }
                           }
                        },
                        {
                           text: {
                              query: req.query.text,
                              path: "post_content",
                              fuzzy: {
                                 maxEdits: 2,
                              },
                              score: { "boost": { "value": 2}}
                           }
                        },
                        {
                           near: {
                              path: "post_time",
                              origin: new Date(Date.now()),
                              pivot: 2592000000,
                           },
                        },
                     ],
                  },
               }
            },
         ])
         if (posts) {
            let to_res = true;
            for (let i=0; i < posts.length;i++){
               const user = await userModel.findById(user_id_mock);
               const comment = await commentModel.find({post_id : posts[i]._id})
               const user_like_sta = await likepostModel.find({user_id : user_id_mock, post_id : posts[i]._id})
               if (user_like_sta.length === 0){
                 to_res = false
               };
               const a_post = new postSend({
                 author : {
                   user_id : posts[i].user_id,
                   username : user.user_name,
                   profile_pic_url : user.profile_pic_url,
                 },
                 post_catagory : posts[i].catagory_id,
                 post_topic : posts[i].catagory_id,
                 post_title : posts[i].post_title,
                 post_content :posts[i].post_content,
                 cover_photo_url : posts[i].cover_photo_url,
                 post_photo_url : posts[i].post_photo_url,
                 post_like_count : posts[i].post_like_count,
                 post_comment_count : comment.length,
                 post_time : posts[i].post_time,
                 user_like_status : to_res
               });
               payload.push(a_post);
            }
         } 
      } 
      res.send(payload);
   } catch (e) {
      res.status(500).send({ message: e.message });
   }
});

module.exports = router;
