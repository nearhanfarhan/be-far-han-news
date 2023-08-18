const { fetchAllTopics, insertTopic } = require("../models/topics.models");

exports.getAllTopics = (request, response, next) => {
  fetchAllTopics()
    .then((topics) => {
      response.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (request, response, next) => {
  const { slug, description } = request.body;
  insertTopic(slug, description).then((topic) => {
    response.status(201).send({ topic: topic });
  }).catch((err) =>{
    next(err)
  });
};
