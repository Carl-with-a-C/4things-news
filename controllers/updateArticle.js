const { patchArticle } = require("../models/patchArticle");

exports.updateArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  patchArticle(inc_votes, article_id)
    .then((article) => {
      res.status(202).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
