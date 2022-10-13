const express = require("express");
const router = express.Router()

const postModel = require("../schemas/modelpost");
const postSend = require("../schemas/model_post_tosend");
const userModel = require("../schemas/modeluser");
const commentModel = require("../schemas/modelcomment");
const likepostModel = require("../schemas/model_like_post");

let posts_per_page = 5

router.get("/post", async (req, res) => {
   try {
      if (!req.query.text){
         res.send("Please insert text parameter!!!")
      }
      else if (!req.query.page){
         res.send("Please insert page parameter!!!")
      }
      else if (req.query.page < 1){
         res.send("Wrong page number")
      }
      else {
         let posts = await postModel
         .aggregate([
            {
               $search: {
                  index: "searchPost",
                  compound: {
                     should: [
                        {
                           autocomplete: {
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
                              pivot: (2592000000*12),
                           },
                        },
                     ],
                  },
               },
            },
         ])
         .skip((req.query.page-1)*posts_per_page)
         .limit(posts_per_page)
         let to_res = false;
         let payload = [];
         for (let i=0; i < posts.length;i++){
            const user = await userModel.findById(posts[i].user_id);
            const comment = await commentModel.find({post_id : posts[i]._id})
            const user_like_sta = await likepostModel.find({user_id : req.user.id, post_id : posts[i]._id})
            if (user_like_sta.length !== 0){
               to_res = true
            };
               a_post = new postSend({
               author : {
                  user_id : posts[i].user_id,
                  username : user.user_name,
                  profile_pic_url : user.profile_pic_url,
               },
               post_catagory : posts[i].catagory_id,
               post_topic : posts[i].topic_id,
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
         res.send(payload)
      }
   } catch (e) {
      res.status(500).send({ message: e.message });
   }
});

router.get("/mypost", async (req, res) => {
   try{
      let posts = postModel.find({user_id: req.user.id})
      .skip((req.query.page-1)*posts_per_page)
      .limit(posts_per_page)
      let to_res = false
      let payload = []
      const user = await userModel.findById(req.user.id);
      for (let i=0; i < posts.length;i++){
         const comment = await commentModel.find({post_id : posts[i]._id})
         const user_like_sta = await likepostModel.find({user_id : user._id, post_id : posts[i]._id})
         if (user_like_sta.length !== 0){
            to_res = true
         };
            a_post = new postSend({
            author : {
               user_id : user._id,
               username : user.user_name,
               profile_pic_url : user.profile_pic_url,
            },
            post_catagory : posts[i].catagory_id,
            post_topic : posts[i].topic_id,
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
      res.send(payload)
   } catch (e) {
      res.status(500).send({ message: e.message });
   }
})

router.get("/post/topic", async (req, res) => {
   try{
      let posts = await postModel.find({
         topic_id: req.query.text
      })
      .skip((req.query.page-1)*posts_per_page)
      .limit(posts_per_page)
      let to_res = false
      let payload = []
      for (let i=0; i < posts.length;i++){
         const user = await userModel.findById(posts[i].user_id);
         const comment = await commentModel.find({post_id : posts[i]._id})
         const user_like_sta = await likepostModel.find({user_id : user._id, post_id : posts[i]._id})
         if (user_like_sta.length !== 0){
            to_res = true
         };
            a_post = new postSend({
            author : {
               user_id : user._id,
               username : user.user_name,
               profile_pic_url : user.profile_pic_url,
            },
            post_catagory : posts[i].catagory_id,
            post_topic : posts[i].topic_id,
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
      res.send(payload)
   } catch (e) {
      res.status(500).send({ message: e.message})
   }
})      

module.exports = router;
