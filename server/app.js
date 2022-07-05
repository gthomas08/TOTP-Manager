const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");

const loginRouter = require("./controllers/login");
const applicationInfoRouter = require("./controllers/application/info");
const applicationResetRouter = require("./controllers/application/reset");
const userEnrollmentRouter = require("./controllers/user/enrollment");
const usersShowRouter = require("./controllers/user/show");
const usersDeleteRouter = require("./controllers/user/delete");

const app = express();

app.use(express.json());
app.use(cors());

// Connect to database
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connection to MongoDB:", error.message);
  });

app.use("/api/login", loginRouter);
app.use("/api/user/enrollment", userEnrollmentRouter);

// Handle token
app.use(middleware.tokenExtractor);

// Admin Routes
app.use(
  "/api/application/info",
  middleware.tokenValidator,
  middleware.adminExtractor,
  applicationInfoRouter
);

app.use(
  "/api/application/reset",
  middleware.tokenValidator,
  middleware.adminExtractor,
  applicationResetRouter
);

app.use(
  "/api/users/show",
  middleware.tokenValidator,
  middleware.adminExtractor,
  usersShowRouter
);

app.use(
  "/api/users/delete",
  middleware.tokenValidator,
  middleware.adminExtractor,
  usersDeleteRouter
);

// Handle errors
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
