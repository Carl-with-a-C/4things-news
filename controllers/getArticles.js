const { fetchArticles } = require("../models/fetchArticles");
const { fetchArticleQueries } = require("../models/fetchArticleQueries");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;

  fetchArticleQueries(topic, sort_by, order)
    .then((articles) => {
      res.send({ articles });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
