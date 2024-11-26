exports.psqlErrorHandler = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
};

exports.customErrorHandler = (err, req, res, next) => {
  console.log("Custom Error Handler Response:", err);

  if (err.status && err.msg) {
    res.status(err.status).send({ message: err.msg });
  } else {
    next(err);
  }
};
