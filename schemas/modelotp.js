const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "user",
  //   required: true,
  // },
  email : {
    type :String

  },
  otp: {
    type: String,
    required: true,
  },
});

const Otp = mongoose.model("otp", otpSchema);

module.exports = Otp;