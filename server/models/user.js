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
  logs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Log",
    },
  ],
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
