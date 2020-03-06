const usersRouter = require("express").Router();

const { getUserById, getAllUsers } = require("../controllers/users-controller");

const { handles405s } = require("../errors/index");

usersRouter
  .route("/")
  .get(getAllUsers)
  .all(handles405s);

usersRouter
  .route("/:user_id")
  .get(getUserById)
  .all(handles405s);

module.exports = usersRouter;
