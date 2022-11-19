const db = require("../db/connection");

exports.deleteComment = (comment_id) => {
  console.log(comment_id);
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((result) => {
      console.log(result.rows);
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found!" });
      } else {
        return result.rows.length;
      }
    });
};
