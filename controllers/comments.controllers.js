const { fetchArticleById } = require("../models/articles.models");
const {
  fetchCommentsByArticle,
  insertCommentsByArticle,
  removeCommentById,
} = require("../models/comments.models");
const { fetchUser } = require("../models/users.models");

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

exports.postCommentsByArticle = (request, response, next) => {
  const { author, body } = request.body;
  const { article_id } = request.params;
  const promises = [
    fetchUser(author),
    fetchArticleById(article_id),
    insertCommentsByArticle(article_id, author, body),
  ];
  Promise.all(promises)
    .then((promiseArray) => {
      return promiseArray[2];
    })
    .then((comment) => {
      response.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
