const { insertComment } = require("../models/insertComment");

exports.postComment = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;

  if (body.username && body.body) {
    insertComment(body, article_id)
      .then((comment) => {
        res.status(201).send({ comment });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } else {
    res.status(400).send({ msg: "Invalid input criteria!" });
  }
};
