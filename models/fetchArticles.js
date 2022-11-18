const db = require("../db/connection");

exports.fetchArticles = () => {
  const queryStr = `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`;
  // SELECT COUNT(article_id) AS comment_count FROM comments;`;
  return db.query(queryStr).then((foundArticles) => {
    return foundArticles.rows;
  });
};
