const connection = require("../db/connection");

// SELECT COUNT(comments.article_id) AS comment_count, comments.article_id  FROM comments
//  LEFT JOIN articles
// ON articles.article_id=comments.article_id
// GROUP BY comments.article_id;

exports.selectArticleById = article_id => {
  return connection
    .select("articles.*")
    .count("comment_id AS comment_count")
    .from("articles")
    .where("articles.article_id", article_id)
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .then(([article]) => {
      if (!article)
        return Promise.reject({ msg: "article not found", status: 404 });
      else return article;
    });
};

exports.updateArticle = (article_id, voteChange = 0) => {
  return connection
    .from("articles")
    .where("article_id", article_id)
    .increment("votes", voteChange)
    .returning("*")
    .then(([article]) => {
      if (!article)
        return Promise.reject({ status: 404, msg: "Sorry, not found!" });
      else return article;
    });
};

exports.createComment = (article_id, newComment) => {
  return connection
    .from("comments")
    .insert(
      [
        {
          author: newComment.username,
          body: newComment.body,
          article_id
        }
      ],
      ["comment_id"]
    )
    .into("comments")
    .returning("*")
    .then(([comment]) => {
      return comment;
    });
};

exports.fetchComments = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select("*")
    .from("comments")
    .where({ article_id })
    .orderBy(sort_by, order);
};
