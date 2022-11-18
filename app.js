const express = require("express");
const app = express();
const { getTopics } = require("./controllers/getTopics");
const { getArticles } = require("./controllers/getArticles");
const { getArticleById } = require("./controllers/getArticleById");
const { getArticleComments } = require("./controllers/getArticleComments");
const { postComment } = require("./controllers/postComment");
const { updateArticle } = require("./controllers/updateArticle");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", updateArticle);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request!" });
  } else {
    if (err.code === "23503" || err.code === "23502") {
      res.status(400).send({ msg: "Bad Request!" });
    } else {
      next(err);
    }
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error!" });
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found!" });
});

module.exports = app;
