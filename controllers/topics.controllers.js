const { fetchAllTopics } = require("../models/topics.models");

exports.getAllTopics = (request, response, next) => {
  fetchAllTopics()
    .then((topics) => {
      response.status(200).send({topics : topics});
    })
    .catch((err) => {
      next(err);
    });
};
