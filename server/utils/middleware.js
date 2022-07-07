/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const logger = require("./logger");
const Admin = require("../models/admin");

// Handle unknown routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Handle errors
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "Invalid token" });
  }

  next(error);
};

// Extract token
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  }
  next();
};

// Validate Admin from token
const adminExtractor = async (request, response, next) => {
  const { token } = request;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const admin = await Admin.findById(decodedToken.id);

  if (!admin) {
    return response.status(401).json({ error: "Unauthorized access." });
  }

  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  adminExtractor,
};
