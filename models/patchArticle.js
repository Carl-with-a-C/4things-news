const db = require("../db/connection");

exports.patchArticle = (vote, article_id) => {
  const queryStr = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;

  return db.query(queryStr, [vote, article_id]).then((updatedArticle) => {
    if (updatedArticle.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article not found!" });
    } else {
      return updatedArticle.rows[0];
    }
  });
};
