const { fetchArticles } = require("../models/fetchArticles");
const { fetchArticleQueries } = require("../models/fetchArticleQueries");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;

  fetchArticleQueries(topic, sort_by, order)
    .then((articles) => {
      if (articles.length === 0) {
        res.status(404).send({ msg: "No article found" });
      } else {
        res.send({ articles });
      }
    })
    .catch((err) => {
      next(err);
    });
};
