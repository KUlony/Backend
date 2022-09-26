const mongoose = require("mongoose");
const PostToSendSchema = new mongoose.Schema({
    author : {
        user_id : {
            type: mongoose.Schema.Types.ObjectId,
		    ref: 'user'
        },
        username : String,
        profile_pic_url : String,
    },
    catagory_id : [{
        type : Number,
    }],
    topic_id : [{
        type : Number,
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
    }],
    post_like_count : {
        type : Number,
        default: 0,
    },
    post_comment_count : Number,
    post_time : {
        type : Date,
    },
});
const Post = mongoose.model("Post_to_send", PostToSendSchema);
module.exports = Post;