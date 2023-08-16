const express = require("express");

const { getAllTopics } = require("./controllers/topics.controllers");

const { getAllArticles } = require("./controllers/articles.controllers");

const { getArticleById } = require("./controllers/articles.controllers");

const { handleCustomErrors, handle400Errors, handle404Errors } = require("./errors/errors");

const { getEndpoints } = require("./controllers/api.controllers");
const { getCommentsByArticle, postCommentsByArticle } = require("./controllers/comments.controllers");

const app = express()

app.use(express.json())

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id/comments", getCommentsByArticle)

app.post("/api/articles/:article_id/comments", postCommentsByArticle)

app.use((request, response) => {
  response.status(404).send({ msg: "Not found" });
});

app.use(handleCustomErrors)

app.use(handle400Errors)

app.use(handle404Errors)

app.use((err, request, response, next) => {
  console.log(err);
  res.status(500).send({ msg: "err" });
});

module.exports = app;
