const connection = require("../db/connection");

exports.updateComment = (comment_id, inc_votes = 0) => {
  return connection
    .from("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(([comment]) => {
      if (!comment)
        return Promise.reject({ status: 404, msg: "Sorry, not found" });
      return comment;
    });
};

exports.removeComment = comment_id => {
  return connection
    .del()
    .from("comments")
    .where("comment_id", "=", comment_id)
    .then(comment => {
      if (comment === 0)
        return Promise.reject({ status: 404, msg: "Sorry, not found!" });
    });
};
