const connection = require('../db/connection');
exports.selectAllTopics = () => {
  return connection.select('*').from('topics');
};

exports.checkTopic = topic => {
  return connection
    .select('*')
    .from('topics')
    .where('topics.slug', topic)
    .then(topic => {
      if (!topic.length)
        return Promise.reject({ status: 404, msg: 'Sorry, not found' });
    });
};
