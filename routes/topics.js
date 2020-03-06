const topicsRouter = require("express").Router();

const { getAllTopics } = require("../controllers/topics-controller");
const { handles405s } = require("../errors/index");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(handles405s);

module.exports = topicsRouter;
