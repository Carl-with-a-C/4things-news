const express = require("express");
const app = express();
const { getTopics } = require("./controllers/getTopics");
const { getArticles } = require("./controllers/getArticles");
const { getArticleById } = require("./controllers/getArticleById");
const { getArticleComments } = require("./controllers/getArticleComments");
const { getUsers } = require("./controllers/getUsers");
const { getApi } = require("./controllers/getApi");
const { postComment } = require("./controllers/postComment");
const { updateArticle } = require("./controllers/updateArticle");
const { removeComment } = require("./controllers/removeComment");
const cors = require("cors");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.get("/api/users", getUsers);
app.get("/api", getApi);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", updateArticle);
app.delete("/api/comments/:comment_id", removeComment);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request!" });
  } else {
    if (err.code === "23503" || err.code === "23502") {
      res.status(400).send({ msg: "bad request!" });
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
