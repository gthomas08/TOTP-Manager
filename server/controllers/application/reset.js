/* eslint-disable no-underscore-dangle */
const applicationResetRouter = require("express").Router();
const crypto = require("crypto");
const Application = require("../../models/application");
const encryption = require("../../utils/encryption");

applicationResetRouter.put("/", async (request, response) => {
  const randomUniqueClientSecret = crypto.randomUUID();

  const encryptedClientSecret = encryption.encryptData(
    randomUniqueClientSecret
  );

  try {
    await Application.updateOne({}, { clientSecret: encryptedClientSecret });
  } catch (error) {
    return response.sendStatus(500);
  }

  return response.sendStatus(200);
});

module.exports = applicationResetRouter;
