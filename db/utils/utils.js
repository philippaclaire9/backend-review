exports.formatDates = list => {
  const updatedArticles = list.map(article => {
    const { created_at: date, ...restOfArticle } = article;

    const updatedArticle = { ...restOfArticle };

    updatedArticle.created_at = new Date(date);

    return updatedArticle;
  });

  return updatedArticles;
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(article => {
    refObj[article.title] = article.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = comments.map(comment => {
    const {
      created_by: name,
      belongs_to: title,
      created_at: date,
      ...restOfComment
    } = comment;

    const updatedComment = { ...restOfComment };

    updatedComment.author = name;

    updatedComment.created_at = new Date(date);

    for (key in articleRef) {
      if (key === comment.belongs_to) {
        updatedComment.article_id = articleRef[key];
      }
    }
    return updatedComment;
  });
  return formattedComments;
};
