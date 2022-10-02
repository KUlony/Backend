const mongoose = require("mongoose");
const TopicSchema = new mongoose.Schema({
    catagory_id : mongoose.Schema.Types.ObjectId,
    topic_name : String,
});
const topic = mongoose.model("topic", TopicSchema);
module.exports = topic;