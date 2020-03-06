const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticle,
  postComment,
  getComments,
  getAllArticles
} = require("../controllers/articles-controller");

const { handles405s } = require("../errors/index");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(handles405s);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .all(handles405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .all(handles405s);

module.exports = articlesRouter;
