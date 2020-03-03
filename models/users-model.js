process.env.NODE_ENV = "test";

const connection = require("../db/connection");

exports.fetchUserById = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then(([user]) => {
      if (!user) return Promise.reject({ msg: "user not found", status: 404 });
      return user;
    });
};
