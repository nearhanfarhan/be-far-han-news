const { fetchEndpoints } = require("../models/api.models");

exports.getEndpoints = (request, response, next) => {
  fetchEndpoints().then((endpoints) => {
    response.status(200).send(endpoints);
  });
};
