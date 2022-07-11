/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const logger = require("./logger");
const Admin = require("../models/admin");
const User = require("../models/user");

// Request logger
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

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
    return response.status(401).json({ error: "Admin unauthorized access." });
  }

  next();
};

// Validate User from token
const userExtractor = async (request, response, next) => {
  const { token } = request;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(401).json({ error: "User unauthorized access." });
  }

  request.username = user.username;

  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  adminExtractor,
  userExtractor,
};
