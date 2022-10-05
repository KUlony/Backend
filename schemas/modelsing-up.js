const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const userSchema = new Schema({
  
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    min: 3,
    max: 255,
    required: true,
  },
  
  
  verified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("sing-up", userSchema);

const validate = (user) => {
  const schema = Joi.object({
    // name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(user);
};

module.exports = {
  User,
  validate,
};