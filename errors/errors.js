exports.handleCustomErrors = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(400).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle400Errors = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};
