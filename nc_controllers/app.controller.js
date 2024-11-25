const endpointsJson = require("../endpoints.json");
const { allTopics } = require("../nc models/app.model");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson }).catch(next);
};

exports.getTopics = (req, res, next) => {
  allTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch(next);
};
