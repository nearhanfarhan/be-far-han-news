const {
  fetchArticleById,
  fetchAllArticles,
  updateArticleVotes,
} = require("../models/articles.models");
const { fetchTopic } = require("../models/topics.models");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (request, response, next) => {
  const { topic, sort_by, order } = request.query;
  const promises = [fetchTopic(topic), fetchAllArticles(topic, sort_by, order)];
  Promise.all(promises)
    .then((promisesArray) => {
      return promisesArray[1];
    })
    .then((articles) => {
      response.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  const promises = [
    updateArticleVotes(article_id, inc_votes),
    fetchArticleById(article_id),
  ];
  Promise.all(promises)
    .then((promiseArray) => {
      response.status(201).send({ article: promiseArray[0] });
    })
    .catch((err) => {
      next(err);
    });
};
