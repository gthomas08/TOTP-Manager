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

// Get user info
usersRouter.get("/:username", async (request, response) => {
  const { username } = request.params;
  const user = await User.findOne({ username }).populate("logs");

  if (!user) {
    return response.sendStatus(404);
  }

  const formattedUser = {
    username: user.username,
    enrolled: user.enrolled,
    logs: user.logs
      .map((log) => ({
        type: log.type,
        date: log.date,
      }))
      .reverse(),
  };

  return response.json(formattedUser);
});

module.exports = usersRouter;
