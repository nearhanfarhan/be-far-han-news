
const {
  fetchArticleById,
  fetchAllArticles,
  updateArticleVotes,
} = require("../models/articles.models");

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
  fetchAllArticles()
    .then((articles) => {
      response.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (request, response, next) => {
    const {article_id} = request.params
    const {inc_votes} = request.body
    updateArticleVotes(article_id, inc_votes).then((article) =>{
        response.status(201).send({article:article})
    })

}