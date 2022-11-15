const express = require("express");
const app = express();
const { getTopics } = require("./controllers/getTopics");
const { getArticles } = require("./controllers/getArticles");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found!" });
});

module.exports = app;
