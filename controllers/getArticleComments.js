const { fetchArticleComments } = require("../models/fetchArticleComments");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  if (/^\d+$/.test(article_id) === false) {
    return Promise.reject({ status: 400, msg: "bad request!" }).catch((err) => {
      next(err);
    });
  } else {
    fetchArticleComments(article_id)
      .then((comments) => {
        // console.log(res);
        res.send({ comments });
      })
      .catch((err) => {
        next(err);
      });
  }
};
