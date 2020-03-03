const usersRouter = require("express").Router();

const { getUserById } = require("../controllers/users-controller");

usersRouter.route("/:user_id").get(getUserById);

module.exports = usersRouter;
