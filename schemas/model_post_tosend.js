const mongoose = require("mongoose");

const catagory = new mongoose.Schema({
    catagory_id : mongoose.Schema.Types.ObjectId,
    catagory_name : String,
})

const topic = new mongoose.Schema({
    topic_id : mongoose.Schema.Types.ObjectId,
    topic_name : String,
})

const PostToSendSchema = new mongoose.Schema({
    author : {
        user_id : {
            type: mongoose.Schema.Types.ObjectId,
		    ref: 'user'
        },
        username : String,
        profile_pic_url : String,
    },
    post_catagory : [catagory],
    post_topic : [topic],
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
    user_like_status : Boolean
});
const Post = mongoose.model("Post_to_send", PostToSendSchema);
module.exports = Post;