exports.handleCustomErrors = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle400Errors = (err, request, response, next) => {
  if (err.code === "22P02"||err.code === "23502") {
    response.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    response.status(404).send({ msg: "Username doesn't exist" });
  } else {
    next(err);
  }
};
