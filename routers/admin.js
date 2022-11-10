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
const { date } = require("joi");

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
        let date = request_topic[i].request_time.toISOString()
        date = date.split("T")[0]
        date = date.split("-")
        const to_res = {
            request_id : request_topic[i]._id,
            user_id : request_topic[i].user_id,
            user_name : author.user_name,
            profile_pic_url : author.profile_pic_url,
            request_topic : request_topic[i].request_topic,
            year : Number(date[0]),
            month : Number(date[1]),
            day : Number(date[2])
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
        
        let report = []
        if (!req.query.sortby || req.query.sortby === "reported") {
            report = await reportpostModel.aggregate([
                {
                    $match: { entity_type: "post"}
                },
                {
                    $group: {
                        _id: "$entity_id",
                        report_type: { $addToSet: "$report_type"},
                        user: { $addToSet: "$user_id" },
                        last_report: { $max: "$report_time" }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        report_type: 1,
                        user: 1,
                        year: { $year: "$last_report"},
                        month: { $month: "$last_report"},
                        day: { $dayOfMonth: "$last_report"},
                        count_user: { $size: "$user"}
                    }
                },
                {
                    $sort: { count_user: -1 }
                }
            ])
        } else if (req.query.sortby === "lasted") {
            report = await reportpostModel.aggregate([
                {
                    $match: { entity_type: "post"}
                },
                {
                    $group: {
                        _id: "$entity_id",
                        report_type: { $addToSet: "$report_type"},
                        user: { $addToSet: "$user_id" },
                        last_report: { $max: "$report_time" }
                    }
                },
                {
                    $sort: { last_report: -1 }
                },
                {
                    $project: {
                        _id: 1,
                        report_type: 1,
                        user: 1,
                        year: { $year: "$last_report"},
                        month: { $month: "$last_report"},
                        day: { $dayOfMonth: "$last_report"},
                        count_user: { $size: "$user"}
                    }
                }
            ])
        }
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
        
        let report = []
        if (!req.query.sortby || req.query.sortby === "reported") {
            report = await reportpostModel.aggregate([
                {
                    $match: { entity_type: "comment"}
                },
                {
                    $group: {
                        _id: "$entity_id",
                        report_type: { $addToSet: "$report_type"},
                        user: { $addToSet: "$user_id" },
                        last_report: { $max: "$report_time" }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        report_type: 1,
                        user: 1,
                        year: { $year: "$last_report"},
                        month: { $month: "$last_report"},
                        day: { $dayOfMonth: "$last_report"},
                        count_user: { $size: "$user"}
                    }
                },
                {
                    $sort: { count_user: -1 }
                }
            ])
        } else if (req.query.sortby === "lasted") {
            report = await reportpostModel.aggregate([
                {
                    $match: { entity_type: "post"}
                },
                {
                    $group: {
                        _id: "$entity_id",
                        report_type: { $addToSet: "$report_type"},
                        user: { $addToSet: "$user_id" },
                        last_report: { $max: "$report_time" }
                    }
                },
                {
                    $sort: { last_report: -1 }
                },
                {
                    $project: {
                        _id: 1,
                        report_type: 1,
                        user: 1,
                        year: { $year: "$last_report"},
                        month: { $month: "$last_report"},
                        day: { $dayOfMonth: "$last_report"},
                        count_user: { $size: "$user"}
                    }
                }
            ])
        }
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
        
        let report = []
        if (!req.query.sortby || req.query.sortby === "reported") {
            report = await reportpostModel.aggregate([
                {
                    $match: { entity_type: "reply"}
                },
                {
                    $group: {
                        _id: "$entity_id",
                        report_type: { $addToSet: "$report_type"},
                        user: { $addToSet: "$user_id" },
                        last_report: { $max: "$report_time" }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        report_type: 1,
                        user: 1,
                        year: { $year: "$last_report"},
                        month: { $month: "$last_report"},
                        day: { $dayOfMonth: "$last_report"},
                        count_user: { $size: "$user"}
                    }
                },
                {
                    $sort: { count_user: -1 }
                }
            ])
        } else if (req.query.sortby === "lasted") {
            report = await reportpostModel.aggregate([
                {
                    $match: { entity_type: "post"}
                },
                {
                    $group: {
                        _id: "$entity_id",
                        report_type: { $addToSet: "$report_type"},
                        user: { $addToSet: "$user_id" },
                        last_report: { $max: "$report_time" }
                    }
                },
                {
                    $sort: { last_report: -1 }
                },
                {
                    $project: {
                        _id: 1,
                        report_type: 1,
                        user: 1,
                        year: { $year: "$last_report"},
                        month: { $month: "$last_report"},
                        day: { $dayOfMonth: "$last_report"},
                        count_user: { $size: "$user"}
                    }
                }
            ])
        }
        res.send(report)
    } catch (e){
        res.status(500).send({message: e.message})
    }
})

router.delete("/delete_report/:entity_id",async (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'ลบ report ของ entity นั้น'
    try{
        const user = await userModel.findById(req.user.id);
        if(!user.admin){response.status(500).send("not a admin");} 

        await reportpostModel.deleteMany({entity_id: req.params.entity_id})
        res.send("Done")
    } catch (e) {
        res.status(500).send({message: e.message})
    }
})

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