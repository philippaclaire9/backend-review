const { fetchUserById, fetchAllUsers } = require("../models/users-model");

exports.getUserById = (req, res, next) => {
  const { user_id } = req.params;
  fetchUserById(user_id)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers().then(users => {
    res.status(200).send({ users });
  });
};
