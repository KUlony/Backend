const express = require("express");
const router = express.Router()

const postModel = require("../schemas/modelpost");
const userModel = require("../schemas/modeluser");
const commentModel = require("../schemas/modelcomment");
const replyModel = require("../schemas/modelreply");
const catagoryModel = require("../schemas/modelcatagory");
const topicModel = require("../schemas/modeltopic");
const followtopicModel = require("../schemas/model_following_topic");
const likepostModel = require("../schemas/model_like_post");
const reportpostModel = require("../schemas/model_report_post");
const noticeModel = require("../schemas/model_notification")
const requesttopicModel = require("../schemas/model_request_topic");

router.get("/get_all_request_topic", async (request, response) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'รับข้อมูล Request Topic ทั้งหมด'
    try {
    const user = await userModel.findById(request.user.id);
    if(!user.admin){response.status(500).send("not a admin");} 
    const request_topic = await requesttopicModel.find({});
    res = [];
    for(i=0;i<request_topic.length;i++){
        const author = await userModel.findById(request_topic[i].user_id);
        const to_res = {
            request_id : request_topic[i]._id,
            user_id : request_topic[i].user_id,
            user_name : author.user_name,
            profile_pic_url : author.profile_pic_url,
            request_topic : request_topic[i].request_topic,
            request_time : request_topic[i].request_time
        }
        res.push(to_res)
    }
      response.send(res);
    } catch (e) {
        response.status(500).send({ message: e.message });
     }
});

router.delete("/remove_request_topic/:request_id", async (request, response) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'ลบ Request topic ออกจาก Database'
    try {
    const user = await userModel.findById(request.user.id);
    if(!user.admin){response.status(500).send("not a admin");} 
        await requesttopicModel.findByIdAndRemove(request.params.request_id);
        response.send("success");
    } catch (e) {
        response.status(500).send({ message: e.message });
     }
});

router.post("/accept_request_topic/:request_id", async (request, response) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'ตอบรับ Request topic โดยส่ง topic_name และ catagory_id ที่ต้องการเพิ่มใน Database จากนั้นทำการลบ Request ออกจาก Database'
    try {
    const user = await userModel.findById(request.user.id);
    if(!user.admin){response.status(500).send("not a admin");} 
    const request_topic = await requesttopicModel.findById(request.params.request_id);
    const topic = new topicModel({
        catagory_id : request.body.catagory_id,
        topic_name : request.body.topic_name
    })
        await topic.save();
        await requesttopicModel.findByIdAndRemove(request.params.request_id);
        response.send("success");
    } catch (e) {
        response.status(500).send({ message: e.message });
     }
});

router.get("/get_post_report", async (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'รับข้อมูล report post ทั้งหมด'
    try{
        const user = await userModel.findById(req.user.id);
        if(!user.admin){response.status(500).send("not a admin");} 
        
        const report = await reportpostModel.aggregate([
            {
                $match: { entity_type: "post"}
            },
            {
                $group: {
                    _id: "$entity_id",
                    report_type: { $addToSet: "$report_type"},
                    number_user: { $count: {} },
                    last_report: { $max: "$report_time" }
                }
            }
        ])
        res.send(report)
    } catch (e){
        res.status(500).send({message: e.message})
    }
})

router.get("/get_comment_report", async (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'รับข้อมูล report comment ทั้งหมด'
    try{
        const user = await userModel.findById(req.user.id);
        if(!user.admin){response.status(500).send("not a admin");} 
        
        const report = await reportpostModel.aggregate([
            {
                $match: { entity_type: "comment"}
            },
            {
                $group: {
                    _id: "$entity_id",
                    report_type: { $addToSet: "$report_type"},
                    number_user: { $count: {} },
                    last_report: { $max: "$report_time" }
                }
            }
        ])
        res.send(report)
    } catch (e){
        res.status(500).send({message: e.message})
    }
})

router.get("/get_reply_report", async (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'รับข้อมูล report reply ทั้งหมด'
    try{
        const user = await userModel.findById(req.user.id);
        if(!user.admin){response.status(500).send("not a admin");} 
        
        const report = await reportpostModel.aggregate([
            {
                $match: { entity_type: "reply"}
            },
            {
                $group: {
                    _id: "$entity_id",
                    report_type: { $addToSet: "$report_type"},
                    number_user: { $count: {} },
                    last_report: { $max: "$report_time" }
                }
            }
        ])
        res.send(report)
    } catch (e){
        res.status(500).send({message: e.message})
    }
})

// router.get("/get_all_report", async (request, response) => {
//     // #swagger.tags = ['Admin']
//     // #swagger.description = 'รับข้อมูล report ทั้งหมด'
//     try {
//         const user = await userModel.findById(request.user.id);
//         if(!user.admin){response.status(500).send("not a admin");} 
//         const report = await reportpostModel.find({});
//         //console.log(report)
//         res = {
//             post : [],
//             comment : [],
//             reply : []
//         };
//         for(i=0;i<report.length;i++){
//             const author = await userModel.findById(report[i].user_id);
//             var to_res = {}
//             if(report[i].entity_type === "post"){
//                 const post = await postModel.findById(report[i].entity_id)
//                 const reported_user = await userModel.findById(post.user_id)
//                 to_res = {
//                     report_id : report[i]._id,
//                     reporter_user_id : report[i].user_id,
//                     reporter_user_name : author.user_name,
//                     reporter_profile_pic_url : author.profile_pic_url,
//                     report_type : report[i].report_type,
//                     post_id : report[i].entity_id,
//                     post_user_id : post.user_id,
//                     post_user_name : reported_user.user_name,
//                     post_profile_pic_url : reported_user.profile_pic_url,
//                     post_title : post.post_title,
//                     post_content : post.post_content,
//                     cover_photo_url : post.cover_photo_url,
//                     post_photo_url : post.post_photo_url
//                 }
//                 res.post.push(to_res);
//             }
//             else if (report[i].entity_type === "comment"){
//                 const comment = await commentModel.findById(report[i].entity_id)
//                 const reported_user = await userModel.findById(comment.user_id)
//                 to_res = {
//                     report_id : report[i]._id,
//                     reporter_user_id : report[i].user_id,
//                     reporter_user_name : author.user_name,
//                     reporter_profile_pic_url : author.profile_pic_url,
//                     report_type : report[i].report_type,
//                     comment_id : report[i].entity_id,
//                     comment_user_id : comment.user_id,
//                     comment_user_name : reported_user.user_name,
//                     comment_profile_pic_url : reported_user.profile_pic_url,
//                     comment_content : comment.comment_content,
//                 }
//                 res.comment.push(to_res);
//             }
//             else {
//                 const reply = await replyModel.findById(report[i].entity_id)
//                 const reported_user = await userModel.findById(reply.user_id)
//                 to_res = {
//                     report_id : report[i]._id,
//                     reporter_user_id : report[i].user_id,
//                     reporter_user_name : author.user_name,
//                     reporter_profile_pic_url : author.profile_pic_url,
//                     report_type : report[i].report_type,
//                     reply_id : report[i].entity_id,
//                     reply_user_id : reply.user_id,
//                     reply_user_name : reported_user.user_name,
//                     reply_profile_pic_url : reported_user.profile_pic_url,
//                     reply_content : reply.reply_content,
//                 }
//                 res.reply.push(to_res);
//             }
//         }
//         response.send(res);
//     } catch (e) {
//         response.status(500).send({ message: e.message });
//      }
// });

router.delete("/delete_report/:report_id", async (request, response) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'ลบ report ที่ส่งมา'
    try {
        const user = await userModel.findById(request.user.id);
        if(!user.admin){response.status(500).send("not a admin");} 
        await reportpostModel.findByIdAndRemove(request.params.report_id)
        response.send("deleted")
    } catch (e) {
        response.status(500).send({ message: e.message });
     }
});

router.put("/delete_reported_entity/:report_id", async (request, response) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'ลบ post comment reply ที่ report นั้นส่งมา'
    try {
        const user = await userModel.findById(request.user.id);
        if(!user.admin){response.status(500).send("not a admin");} 
        const report = await reportpostModel.findById(request.params.report_id)
        if(report.entity_type === "post"){
            const post = postModel.findById(report.entity_id)
            const notice = new noticeModel({
                entity_user_id: post.user_id,
                entity_id: report.entity_id,
                notice_type: "postdeleted"
            })
            await notice.save();
            await postModel.findByIdAndUpdate(report.entity_id,{post_status : "deleted by admin"}) 
        }
        else if (report.entity_type === "comment"){
            const comment = commentModel.findById(report.entity_id)
            const notice = new noticeModel({
                entity_user_id: comment.user_id,
                entity_id: report.entity_id,
                notice_type: "commentdeleted"
            })
            await notice.save();
            await commentModel.findByIdAndUpdate(report.entity_id,{comment_status : "deleted by admin"})
        }
        else {
            const reply = replyModel.findById(report.entity_id)
            const notice = new noticeModel({
                entity_user_id: reply.user_id,
                entity_id: report.entity_id,
                notice_type: "replydeleted"
            })
            await notice.save();
            await replyModel.findByIdAndUpdate(report.entity_id,{reply_status : "deleted by admin"})
        }
        await reportpostModel.findByIdAndRemove(request.params.report_id)
        response.send("deleted")
    } catch (e) {
        response.status(500).send({ message: e.message });
     }
});

module.exports = router;