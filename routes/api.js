const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const usersRouter = require("./users");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const { getEndpoints } = require("../controllers/endpoints-controller");
const { handles405s } = require("../errors");

apiRouter
  .route("/")
  .get(getEndpoints)
  .all(handles405s);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
