const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");
const app = express()

app.get("/api/topics", getAllTopics)

app.get("/api", getEndpoints)

app.use((err, request, response, next) => {
    console.log(err);
    res.status(500).send({ msg: "err" });
  });

module.exports = app