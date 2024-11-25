const endpointsJson = require("../endpoints.json");
const { allTopics, allArticles } = require("../nc models/app.model");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  allTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { article_id } = req.params;
  allArticles(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
