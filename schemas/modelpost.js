const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
    },
    catagory_id : [{
        type : mongoose.Schema.Types.ObjectId,
    }],
    topic_id : [{
        type : mongoose.Schema.Types.ObjectId,
    }],
    post_title : {
        type: String,
        required: true,
    },
    post_content : {
        type: String,
        required: true,
    },
    cover_photo_url : {
        type: String,
        default : null,
    },
    post_photo_url : [{
        type: String,
        default : null,
    }],
    post_like_count : {
        type : Number,
        default: 0,
    },
    post_time : {
        type : Date,
        default : Date.now()
    },
    post_status : {
        type: String,
        default: "visible",
    },
    post_delete_time : {
        type : Date,
        timestamps : true ,
        default : null,
    },
    post_before_edit_id : {
        type: mongoose.Schema.Types.ObjectId,
    },
});
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;