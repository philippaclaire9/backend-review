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

exports.updateArticle = (article_id, voteChange) => {
  console.log(voteChange);

  return connection
    .from("articles")
    .where("article_id", article_id)
    .increment("votes", voteChange)
    .returning("*")
    .then(([article]) => {
      console.log(article);
      return article;
    });
};

exports.createComment = (article_id, newComment) => {
  console.log(article_id);
  return connection
    .from("comments")
    .insert(
      [
        {
          author: newComment.username,
          body: newComment.body,
          article_id,
          created_at: new Date()
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
