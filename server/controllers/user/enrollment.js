/* eslint-disable no-underscore-dangle */
const userEnrollmentRouter = require("express").Router();
const otplib = require("otplib");
const Application = require("../../models/application");
const User = require("../../models/user");
const encryption = require("../../utils/encryption");

userEnrollmentRouter.get(
  "/:clientID/:clientSecret/:username",
  async (request, response) => {
    const { clientID, clientSecret, username } = request.params;

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

      // If the user is not enrolled
      if (!existingdUser.enrolled) {
        // Generate QR Code
        const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=otpauth%3A%2F%2Ftotp%2FShibboleth%3A${existingdUser.username}%3Fsecret%3D${decryptedSeed}%26issuer%3DShibboleth&size=200x200&ecc=M&margin=0`;

        // Return json with QR Code
        return response.json({
          username: existingdUser.username,
          seed: decryptedSeed,
          enrolled: existingdUser.enrolled,
          qrCode,
        });
      }

      // If the user is enrolled
      // Return json without QR Code
      return response.json({
        username: existingdUser.username,
        seed: decryptedSeed,
        enrolled: existingdUser.enrolled,
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

    // Generate QR Code
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=otpauth%3A%2F%2Ftotp%2FShibboleth%3A${savedUser.username}%3Fsecret%3D${decryptedSeed}%26issuer%3DShibboleth&size=200x200&ecc=M&margin=0`;

    // Return json
    return response.json({
      username: savedUser.username,
      seed: decryptedSeed,
      enrolled: savedUser.enrolled,
      qrCode,
    });
  }
);

module.exports = userEnrollmentRouter;
