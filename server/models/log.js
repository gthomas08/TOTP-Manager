const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Create schema for application
const logSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ["Granted", "Denied"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

logSchema.plugin(uniqueValidator);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
