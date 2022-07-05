/* eslint-disable no-underscore-dangle */
const usersDeleteRouter = require("express").Router();
const User = require("../../models/user");

usersDeleteRouter.delete("/", async (request, response) => {
  const { body } = request;

  await User.deleteMany({
    username: {
      $in: body,
    },
  });

  return response.sendStatus(204);
});

module.exports = usersDeleteRouter;
