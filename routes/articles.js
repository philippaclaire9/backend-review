const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticle,
  postComment
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle);

articlesRouter.route("/:article_id/comments").post(postComment);

module.exports = articlesRouter;
