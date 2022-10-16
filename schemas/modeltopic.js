const mongoose = require("mongoose");
const TopicSchema = new mongoose.Schema({
    catagory_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    topic_name : {
        type: String,
        required: true
    }
});
const topic = mongoose.model("topic", TopicSchema);
module.exports = topic;