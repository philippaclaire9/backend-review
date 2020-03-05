const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticle,
  postComment,
  getComments,
  getAllArticles
} = require("../controllers/articles-controller");

articlesRouter.route("/").get(getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments);

module.exports = articlesRouter;
