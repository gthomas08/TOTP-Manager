const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");

const loginRouter = require("./controllers/authentication/login");

const dashboardRouter = require("./controllers/dashboard/dashboard");

const applicationRouter = require("./controllers/application/application");
const applicationResetRouter = require("./controllers/application/reset");

const usersRouter = require("./controllers/users/users");
const usersEnrollmentRouter = require("./controllers/users/enrollment");

const userLogRouter = require("./controllers/users/log");

const app = express();

app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);

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
app.use("/api/users/enrollment", usersEnrollmentRouter);

// Handle token
app.use(middleware.tokenExtractor);

// Routes used by admin
app.use("/api/dashboard", middleware.adminExtractor, dashboardRouter);
app.use("/api/application", middleware.adminExtractor, applicationRouter);
app.use(
  "/api/application/reset",
  middleware.adminExtractor,
  applicationResetRouter
);
app.use("/api/users/", middleware.adminExtractor, usersRouter);

// Routes used by users
app.use("/api/user/log", middleware.userExtractor, userLogRouter);

// Handle errors
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
