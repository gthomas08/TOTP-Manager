const usersRouter = require("express").Router();
const User = require("../../models/user");

// Get all users and their enrollment status
usersRouter.get("/", async (request, response) => {
  const users = await User.find({});

  const formattedUsers = users.map((user) => ({
    username: user.username,
    status: user.enrolled ? "Enrolled" : "Not Enrolled",
  }));

  return response.json(formattedUsers);
});

// Delete mulriple users
usersRouter.delete("/", async (request, response) => {
  const { body } = request;

  await User.deleteMany({
    username: {
      $in: body,
    },
  });

  return response.sendStatus(204);
});

module.exports = usersRouter;
