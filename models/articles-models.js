const connection = require("../db/connection");

exports.selectArticleById = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(([article]) => {
      if (!article)
        return Promise.reject({ msg: "article not found", status: 404 });
      else return article;
    });
};

exports.updateArticle = (article_id, voteChange) => {
  if (!voteChange)
    return Promise.reject({
      msg: "oops, not found (key added incorrectly)",
      status: 404
    });

  return connection
    .from("articles")
    .where("article_id", article_id)
    .increment("votes", voteChange)
    .returning("*")
    .then(([article]) => {
      return article;
    });
};
