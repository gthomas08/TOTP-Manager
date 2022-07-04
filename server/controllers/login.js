/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const Admin = require("../models/admin");

loginRouter.post("/", async (request, response) => {
  const { body } = request;

  const admin = await Admin.findOne({ username: body.username });
  const passwordCorrect =
    admin === null
      ? false
      : await bcrypt.compare(body.password, admin.passwordHash);

  if (!(admin && passwordCorrect)) {
    return response.status(401).json({
      error: "Invalid Username or Password",
    });
  }

  const adminForToken = {
    username: admin.username,
    id: admin._id,
  };

  const token = jwt.sign(adminForToken, process.env.SECRET);

  return response.status(200).send({
    token,
    username: admin.username,
  });
});

module.exports = loginRouter;
