const db = require("../db/connection");

exports.fetchArticleQueries = (
  articleTopic,
  sort_by = "created_at",
  order = "desc"
) => {
  if (sort_by === undefined) {
    sort_by = "created_at";
  }
  if (order === undefined) {
    order = "desc";
  }

  const validSortBys = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  let queryValue = [];

  let queryStr = `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, COUNT(comments.article_id)::INT AS comment_count from articles LEFT JOIN comments ON comments.article_id = articles.article_id`;
  console.log(order);

  if (typeof articleTopic === "string") {
    queryValue.push(articleTopic);
    console.log(queryValue);
    queryStr += ` WHERE topic = $1`;
  }

  queryStr += ` GROUP BY articles.article_id`;

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query!" });
  } else {
    queryStr += ` ORDER BY ${sort_by}`;
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  } else {
    queryStr += ` ${order}`;
  }
  console.log(queryStr);

  return db.query(queryStr, queryValue).then((queriedArticles) => {
    return queriedArticles.rows;
  });
};
