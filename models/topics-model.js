process.env.NODE_ENV = "test";

const connection = require("../db/connection");
exports.selectAllTopics = () => {
  return connection.select("*").from("topics");
};
