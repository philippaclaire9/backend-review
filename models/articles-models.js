const connection = require("../db/connection");
const { checkAuthor } = require("../models/users-model");
const { checkTopic } = require("../models/topics-model");

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
    .orderBy(sort_by, order)
    .then(comments => {
      if (!comments.length)
        return Promise.reject({ status: 404, msg: "Sorry, not found!" });
      else return comments;
    });
};

exports.fetchAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  if (order !== "desc" && order !== "asc")
    return Promise.reject({ status: 400, msg: "Sorry, Bad Request!" });
  else {
    return connection

      .select("articles.*")
      .count("comment_id AS comment_count")
      .from("articles")
      .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
      .groupBy("articles.article_id")
      .modify(query => {
        if (author) query.where("articles.author", "=", author);
        if (topic) query.where("topic", "=", topic);
      })
      .orderBy(sort_by, order)
      .then(articles => {
        if (!articles.length) {
          const promiseArray = [articles];
          if (topic) {
            promiseArray.push(checkTopic(topic));
          }

          if (author) {
            promiseArray.push(checkAuthor(author));
          }

          return Promise.all(promiseArray).then(([emptyArticles]) => {
            return emptyArticles;
          });
        } else return articles;
      });
  }
};
