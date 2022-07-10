/* eslint-disable no-underscore-dangle */
const userLogRouter = require("express").Router();
const otplib = require("otplib");
const Log = require("../../models/log");
const User = require("../../models/user");
const encryption = require("../../utils/encryption");

userLogRouter.post("/", async (request, response) => {
  const { username, body } = request;

  const user = await User.findOne({ username });

  const decryptedSeed = encryption.decryptData(user.seed);

  const isValid = otplib.authenticator.check(body.totp, decryptedSeed);

  if (isValid) {
    await User.updateOne({ username: user.username }, { enrolled: true });

    const log = new Log({
      type: "Granted",
      date: new Date(),
      user: user._id,
    });

    const savedLog = await log.save();

    user.logs = user.logs.concat(savedLog._id);
    await user.save();
  } else if (user.enrolled) {
    const log = new Log({
      type: "Denied",
      date: new Date(),
      user: user._id,
    });

    const savedLog = await log.save();

    user.logs = user.logs.concat(savedLog._id);
    await user.save();
  }

  return response.sendStatus(200);
});

module.exports = userLogRouter;
