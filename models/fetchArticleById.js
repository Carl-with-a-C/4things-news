const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  const queryStr = `SELECT * FROM articles WHERE article_id = $1;`;

  return db.query(queryStr, [article_id]).then((fetchedArticle) => {
    if (fetchedArticle.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article not found!" });
    } else {
      return fetchedArticle.rows[0];
    }
  });
};
