const express = require("express");

const { getAllTopics } = require("./controllers/topics.controllers");

const { getAllArticles, patchArticleVotesById } = require("./controllers/articles.controllers");

const { getArticleById } = require("./controllers/articles.controllers");

const { handleCustomErrors, handle400Errors} = require("./errors/errors");

const { getEndpoints } = require("./controllers/api.controllers");

const { getCommentsByArticle, postCommentsByArticle, deleteCommentById } = require("./controllers/comments.controllers");
const { getAllUsers } = require("./controllers/users.controllers");

const app = express()

app.use(express.json())

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id/comments", getCommentsByArticle)


app.post("/api/articles/:article_id/comments", postCommentsByArticle)

app.patch("/api/articles/:article_id", patchArticleVotesById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getAllUsers)

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
