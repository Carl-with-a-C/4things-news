const { fetchArticleById } = require("../models/fetchArticleById");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  if (/^\d+$/.test(article_id) === false) {
    return Promise.reject({ status: 400, msg: "bad request!" }).catch((err) => {
      next(err);
    });
  } else {
    fetchArticleById(article_id)
      .then((article) => {
        res.send({ article });
      })
      .catch((err) => {
        next(err);
      });
  }
};
