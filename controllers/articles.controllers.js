const {
  fetchArticleById,
  fetchAllArticles,
  updateArticleVotesById,
  insertArticle,
} = require("../models/articles.models");
const { fetchTopic, insertTopic } = require("../models/topics.models");
const { fetchUserByUsername } = require("../models/users.models");

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

exports.patchArticleVotesById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  const promises = [
    updateArticleVotesById(article_id, inc_votes),
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

exports.postArticle = (request, response, next) => {
  const { author, title, body, topic, article_img_url } = request.body;

  fetchTopic(topic)
    .catch((err) => {
      if (err.status === 404) {
        insertTopic(topic);
      } else {
        next(err);
      }
    })
    .then(() => {
      const promises = [
        fetchUserByUsername(author),
        insertArticle(author, title, body, topic, article_img_url),
      ];
      return Promise.all(promises).then((promiseArray) => {
        return promiseArray[1];
      });
    })
    .then((article) => {
      response.status(201).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

// exports.postArticle = (request, response, next) => {

//   const { author, title, body, topic, article_img_url } = request.body;

//   fetchTopic(topic).then(()=>{
//     const promises = [
//       fetchUserByUsername(author),
//       insertArticle(author, title, body, topic, article_img_url),
//     ];
//     return Promise.all(promises).then((promiseArray)=>{
//       return promiseArray[1]
//     })
//   }).catch((error)=>{
//     if(error.status===404){
//       const promises = [
//         insertTopic(topic), fetchUserByUsername(author),insertArticle(author, title, body, topic, article_img_url),
//       ]
//       return Promise.all(promises).then((promiseArray)=>{
//         return promiseArray[2]
//       })
//     } else {
//       next(error)
//     }
//   })
//     .then((article) => {
//       response.status(201).send({ article: article });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
