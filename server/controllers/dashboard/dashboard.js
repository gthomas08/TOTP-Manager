const dashboardRouter = require("express").Router();
const User = require("../../models/user");

dashboardRouter.get("/", async (request, response) => {
  const totalUsers = await User.count({});
  const enrolledUsers = await User.count({ enrolled: true });

  const stats = {
    totalUsers,
    enrolledUsers,
  };

  return response.json(stats);
});

module.exports = dashboardRouter;
