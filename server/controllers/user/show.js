/* eslint-disable no-underscore-dangle */
const usersShowRouter = require("express").Router();
const User = require("../../models/user");

usersShowRouter.get("/", async (request, response) => {
  const users = await User.find({});

  const formattedUsers = users.map((user) => ({
    username: user.username,
    status: user.enrolled ? "Enrolled" : "Not Enrolled",
  }));

  return response.json(formattedUsers);
});

module.exports = usersShowRouter;
