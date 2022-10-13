const mongoose = require("mongoose");
const CatagorySchema = new mongoose.Schema({
    catagory_name : {
        type: String,
        required: true
    }
});
const catagory = mongoose.model("catagories", CatagorySchema);
module.exports = catagory;