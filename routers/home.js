const express = require("express");
const router = express.Router()

const postModel = require("../schemas/modelpost");
const userModel = require("../schemas/modeluser");
const commentModel = require("../schemas/modelcomment");
const likepostModel = require("../schemas/model_like_post");
const followtopicModel = require("../schemas/model_following_topic");
const { default: mongoose } = require("mongoose");

let posts_per_page = 5

router.get("/", async (req, res) => {
   // #swagger.tags = ['Home']
   // #swagger.description = 'ขอข้อมูลไปแสดงในหน้า Home'
   try {
      if (!req.query.page){
         res.send("Please insert page parameter!!!")
      }
      else if (req.query.page < 1){
         res.send("Wrong page number")
      }
      else {
         const user = await userModel.findById(req.user.id)
         let follow_topic = await followtopicModel.find({user_id: req.user.id})
         let topics = []
         for (let i=0; i<follow_topic.length; i++){
            if (!topics.includes(follow_topic[i].topic_id.toString())){
            topics.push(follow_topic[i].topic_id.toString())
            }
         }
         for (let i=0; i<user.visit_post.length; i++){
            const post = await postModel.findById(user.visit_post[i])
            if (!post) {continue}
            for (let j=0; j<post.topic_id.length; j++){
               if (!topics.includes(post.topic_id[j].toString())){
               topics.push(post.topic_id[j].toString())
               }
            }
         }
         topics.forEach(() => {
            topics.push(mongoose.Types.ObjectId(topics.shift()))
         });
         let posts = await postModel
         .aggregate([
            { $sort: {
                  post_time: 1,
               }
            },
            { $unwind : "$topic_id" },
            {
               $match: {
                  post_status : "visible",
                  topic_id: { "$in": topics }
               }
            },
            {
               $group: {
                  _id : "$_id"
               }
            },
         ])
         .skip((req.query.page - 1)*posts_per_page)
         .limit(posts_per_page)
         let to_res = false;
         let payload = [];
         for (let i=0; i < posts.length;i++){
            const post = await postModel.findById(posts[i])
            const user = await userModel.findById(post.user_id);
            const comment = await commentModel.find({post_id : post._id})
            to_res = false
            const user_like_sta = await likepostModel.find({user_id : req.user.id, post_id : post._id})
            if (user_like_sta.length !== 0){
               to_res = true
            };
               const a_post = {
               author : {
                  user_id : post.user_id,
                  username : user.user_name,
                  profile_pic_url : user.profile_pic_url,
               },
               post_id : post._id,
               post_catagory : post.catagory_id,
               post_topic : post.topic_id,
               post_title : post.post_title,
               post_content :post.post_content,
               cover_photo_url : post.cover_photo_url,
               post_photo_url : post.post_photo_url,
               post_like_count : post.post_like_count,
               post_comment_count : comment.length,
               post_time : post.post_time,
               user_like_status : to_res
            }
            payload.push(a_post);
         }
         res.send(payload)
      }
   } catch (e) {
      res.status(500).send({ message: e.message });
   }
});

module.exports = router