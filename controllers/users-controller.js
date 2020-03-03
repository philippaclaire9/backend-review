const { fetchUserById } = require("../models/users-model");

exports.getUserById = (req, res, next) => {
  const { user_id } = req.params;
  fetchUserById(user_id)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
