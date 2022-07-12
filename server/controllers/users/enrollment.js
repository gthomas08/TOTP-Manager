/* eslint-disable no-underscore-dangle */
const usersEnrollmentRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const otplib = require("otplib");
const Application = require("../../models/application");
const User = require("../../models/user");
const encryption = require("../../utils/encryption");

usersEnrollmentRouter.get("/:username", async (request, response) => {
  const { username } = request.params;

  const authorization = request.get("authorization");
  const [clientID, clientSecret] = authorization.split(" ");

  // Check if application credentials are correct
  const clientSecretEncrypted = encryption.encryptData(clientSecret);
  const application = await Application.findOne({
    clientID,
    clientSecret: clientSecretEncrypted,
  });

  // Return error if application credetials are not correct
  if (!application) {
    return response.sendStatus(401);
  }

  // Find the user
  const existingdUser = await User.findOne({ username });

  // Generate seed
  const seed =
    otplib.authenticator.generateSecret() +
    otplib.authenticator.generateSecret();

  // Encrypt seed
  const encryptedSeed = encryption.encryptData(seed);

  // If the user exists
  if (existingdUser) {
    // Decrypt seed
    const decryptedSeed = encryption.decryptData(existingdUser.seed);

    // Object to generate token
    const userForToken = {
      username: existingdUser.username,
      id: existingdUser._id,
    };

    // Generate token for user
    const token = jwt.sign(userForToken, process.env.SECRET);

    // If the user is not enrolled
    if (!existingdUser.enrolled) {
      // Generate QR Code
      const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=otpauth%3A%2F%2Ftotp%2F${application.name}%3A${existingdUser.username}%3Fsecret%3D${decryptedSeed}%26issuer%3D${application.name}&size=200x200&ecc=M&margin=0`;

      // Return json with QR Code
      return response.json({
        username: existingdUser.username,
        seed: decryptedSeed,
        enrolled: existingdUser.enrolled,
        qrCode,
        token,
      });
    }

    // If the user is enrolled
    // Return json without QR Code
    return response.json({
      username: existingdUser.username,
      seed: decryptedSeed,
      enrolled: existingdUser.enrolled,
      token,
    });
  }

  // If the user does not exist

  // Create user
  const user = new User({
    username,
    seed: encryptedSeed,
    enrolled: false,
  });

  // Save the user
  const savedUser = await user.save();

  // Decrypt seed
  const decryptedSeed = encryption.decryptData(savedUser.seed);

  // Object to generate token
  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };

  // Generate token for user
  const token = jwt.sign(userForToken, process.env.SECRET);

  // Generate QR Code
  const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=otpauth%3A%2F%2Ftotp%2F${application.name}%3A${savedUser.username}%3Fsecret%3D${decryptedSeed}%26issuer%3D${application.name}&size=200x200&ecc=M&margin=0`;

  // Return json
  return response.json({
    username: savedUser.username,
    seed: decryptedSeed,
    enrolled: savedUser.enrolled,
    qrCode,
    token,
  });
});

module.exports = usersEnrollmentRouter;
