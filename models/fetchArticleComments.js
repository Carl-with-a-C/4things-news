const db = require("../db/connection");

exports.fetchArticleComments = (article_id) => {
  const queryStr = `SELECT * FROM comments WHERE article_id = $1;`;

  return db.query(queryStr, [article_id]).then((fetchedComments) => {
    if (fetchedComments.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "comment not found!" });
    } else {
      return fetchedComments.rows;
    }
  });
};
