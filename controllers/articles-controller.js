const {
  selectArticleById,
  updateArticle,
  createComment
} = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;

  const { inc_votes } = req.body;

  updateArticle(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;

  const newComment = req.body;
  createComment(article_id, newComment)
    .then(comment => {
      res.sendStatus(201);
    })
    .catch(next);
};
