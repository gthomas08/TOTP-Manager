/* eslint-disable no-underscore-dangle */
const applicationRouter = require("express").Router();
const crypto = require("crypto");
const Application = require("../../models/application");
const encryption = require("../../utils/encryption");

applicationRouter.get("/", async (request, response) => {
  const existingApplication = await Application.findOne({});
  const defaultAppName = "Shibboleth";

  // If the application is already created
  if (existingApplication) {
    // Decrypt clientSecret
    const decryptedClientSecret = encryption.decryptData(
      existingApplication.clientSecret
    );

    const decryptedExistingApplication = {
      name: existingApplication.name,
      clientID: existingApplication.clientID,
      clientSecret: decryptedClientSecret,
    };

    return response.json(decryptedExistingApplication);
  }

  // If the application is not created
  const randomUniqueClientID = crypto.randomUUID();
  const randomUniqueClientSecret = crypto.randomUUID();

  // Encrypt clientSecret
  const encryptedClientSecret = encryption.encryptData(
    randomUniqueClientSecret
  );

  // Create application with credentials
  const application = new Application({
    name: defaultAppName,
    clientID: randomUniqueClientID,
    clientSecret: encryptedClientSecret,
  });

  // Save the application
  const savedApplication = await application.save();

  // Decrypt clientSecret
  const decryptedClientSecret = encryption.decryptData(
    savedApplication.clientSecret
  );

  // Object to return
  const decryptedSavedApplication = {
    name: savedApplication.name,
    clientID: savedApplication.clientID,
    clientSecret: decryptedClientSecret,
  };

  return response.json(decryptedSavedApplication);
});

applicationRouter.put("/", async (request, response) => {
  const { name } = request.body;

  await Application.findOneAndUpdate({}, { name });

  return response.sendStatus(200);
});

module.exports = applicationRouter;
