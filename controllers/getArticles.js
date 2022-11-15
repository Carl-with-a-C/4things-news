const { fetchArticles } = require("../models/fetchArticles");

exports.getArticles = (req, res) => {
  fetchArticles().then((fetchedArticles) => {
    console.log(fetchedArticles);
    res.send({ articles: fetchedArticles });
  });
};
