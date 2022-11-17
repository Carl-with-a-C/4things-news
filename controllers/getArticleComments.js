const { fetchArticleComments } = require("../models/fetchArticleComments");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleComments(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
