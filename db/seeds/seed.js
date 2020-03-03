const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData);
      const usersInsertions = knex("users").insert(userData);

      return Promise.all([topicsInsertions, usersInsertions])
        .then(() => {
          const formattedArticles = formatDates(articleData);

          return knex
            .insert(formattedArticles)
            .into("articles")
            .returning("*");
        })
        .then(articleRows => {
          const articleRef = makeRefObj(articleRows);

          const formattedComments = formatComments(commentData, articleRef);

          // return knex
          //   .insert(formattedComments)
          //   .into("comments")
          //   .returning("*");
          // above will do same as below
          return knex("comments").insert(formattedComments);
        });
    });
};
