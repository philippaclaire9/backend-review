const connection = require("../db/connection");

exports.selectArticleById = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(([article]) => {
      if (!article)
        return Promise.reject({ msg: "article not found", status: 404 });
      return article;
    });
};
