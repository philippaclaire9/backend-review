const connection = require('../db/connection');

exports.fetchUserById = username => {
  return connection
    .select('*')
    .from('users')
    .where('username', username)
    .then(([user]) => {
      if (!user) return Promise.reject({ msg: 'user not found', status: 404 });
      return user;
    });
};

exports.fetchAllUsers = () => {
  return connection.select('*').from('users');
};

exports.checkAuthor = author => {
  return connection
    .select('*')
    .from('users')
    .where('users.username', author)
    .then(author => {
      if (!author)
        return Promise.reject({ status: 404, msg: 'Sorry, not found' });
    });
};
