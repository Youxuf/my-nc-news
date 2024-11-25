exports.psqlErrorHandler = (err, request, response, next) => {
    if (err.code === "22P02") {
        response.status(400).send({ message: "Invalid id type" });
    } else {
        next(err);
    }
};

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
    } else {
        next(err);
    }
};
