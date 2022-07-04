/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Create schema for application
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  seed: {
    type: String,
    unique: true,
    required: true,
  },
  enrolled: {
    type: Boolean,
    required: true,
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
