const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Create schema for admin
const adminSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

adminSchema.plugin(uniqueValidator);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
