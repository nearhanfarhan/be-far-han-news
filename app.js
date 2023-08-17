const express = require("express");

const { handleCustomErrors, handle400Errors} = require("./errors/errors");

const apiRouter = require("./routes/api-router");

const app = express()

app.use(express.json())

app.use("/api", apiRouter)

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
