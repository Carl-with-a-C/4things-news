const { fetchArticles } = require("../models/fetchArticles");

exports.getArticles = (req, res) => {
  fetchArticles().then((fetchedArticles) => {
    res.send({ articles: fetchedArticles });
  });
};
