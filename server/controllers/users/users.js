/* eslint-disable no-underscore-dangle */
const usersRouter = require("express").Router();
const otplib = require("otplib");
const User = require("../../models/user");
const Log = require("../../models/log");
const encryption = require("../../utils/encryption");

// Get all users and their enrollment status
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("logs");

  const formattedUsers = users.map((user) => ({
    username: user.username,
    status: user.enrolled ? "Enrolled" : "Not Enrolled",
    lastLogin: user.logs[user.logs.length - 1].date,
  }));

  return response.json(formattedUsers);
});

// Delete multiple users
usersRouter.delete("/", async (request, response) => {
  const { body } = request;

  const users = await User.find({
    username: {
      $in: body,
    },
  });

  await User.deleteMany({
    username: {
      $in: body,
    },
  });

  await Log.deleteMany({
    user: {
      $in: users.map((user) => user._id),
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

// Reset seed for the user
usersRouter.put("/:username", async (request, response) => {
  const { username } = request.params;

  // Generate seed
  const seed =
    otplib.authenticator.generateSecret() +
    otplib.authenticator.generateSecret();

  // Encrypt seed
  const encryptedSeed = encryption.encryptData(seed);

  try {
    await User.updateOne(
      { username },
      { enrolled: false, seed: encryptedSeed }
    );
  } catch (error) {
    return response.sendStatus(500);
  }

  return response.sendStatus(200);
});

module.exports = usersRouter;
