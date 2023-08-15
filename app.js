const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getAllArticles } = require("./controllers/articles.controllers");
const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.use((request, response) => {
  response.status(404).send({ msg: "Not found" });
});

app.use((err, request, response, next) => {
  console.log(err);
  res.status(500).send({ msg: "err" });
});

module.exports = app;
