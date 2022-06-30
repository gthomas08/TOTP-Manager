/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Create schema for application
const applicationSchema = mongoose.Schema({
  clientID: {
    type: String,
    unique: true,
    required: true,
  },
  clientSecret: {
    type: String,
    unique: true,
    required: true,
  },
});

// Delete unwanted information
applicationSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

applicationSchema.plugin(uniqueValidator);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
