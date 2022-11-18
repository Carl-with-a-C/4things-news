const db = require("../db/connection");

exports.insertComment = (newComment, article_id) => {
  const { username, body } = newComment;

  const queryStr = `SELECT * FROM articles WHERE article_id = $1;`;

  return db.query(queryStr, [article_id]).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article not found!" });
    } else {
      const queryStr = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`;

      const queryValues = [username, body, article_id];

      return db.query(queryStr, queryValues).then((res) => {
        {
          return res.rows[0];
        }
      });
    }
  });
};
