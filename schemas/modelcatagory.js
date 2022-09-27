const mongoose = require("mongoose");
const CatagorySchema = new mongoose.Schema({
    catagory_name : String,
});
const catagory = mongoose.model("catagories", CatagorySchema);
module.exports = catagory;