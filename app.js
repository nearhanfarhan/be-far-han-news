const express = require("express");

const { getAllTopics } = require("./controllers/topics.controllers");

const { getAllArticles } = require("./controllers/articles.controllers");

const { getArticleById } = require("./controllers/articles.controllers");

const { handleCustomErrors, handle400Errors } = require("./errors/errors");

const { getEndpoints } = require("./controllers/api.controllers");
const { getCommentsByArticle } = require("./controllers/comments.controllers");

const app = express()


app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id/comments", getCommentsByArticle)


app.use((request, response) => {
  response.status(404).send({ msg: "Not found" });
});

app.use(handleCustomErrors)

app.use(handle400Errors)

app.use((err, request, response, next) => {
  console.log(err);
  res.status(500).send({ msg: "err" });
});

module.exports = app;
