const commentsRouter = require("express").Router();

const {
  patchComment,
  deleteComment
} = require("../controllers/comments-controller");

const { handles405s } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(handles405s);

module.exports = commentsRouter;
