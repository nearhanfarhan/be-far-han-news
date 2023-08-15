const { fetchArticleById } = require("../models/articles.models");
const { fetchCommentsByArticle } = require("../models/comments.models");
const { getArticleById } = require("./articles.controllers");

exports.getCommentsByArticle = (request, response, next) => {
  const { article_id } = request.params;
  const promises = [
    fetchCommentsByArticle(article_id),
    fetchArticleById(article_id),
  ];
  Promise.all(promises)
    .then((promiseArray) => {
      return promiseArray[0];
    })
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};
