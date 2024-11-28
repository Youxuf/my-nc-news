const endpointsJson = require("../endpoints.json");
const {
  allTopics,
  allArticles,
  singleArticle,
  allComments,
  insertComment,
  updateArticleVotes,
  removeComment,
  selectUsers,
} = require("../nc models/app.model");
const { checkArticleExists } = require("./check");

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
  singleArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const{sort_by, order} = req.query
  allArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [allComments(article_id)];

  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }

  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  const newComment = { username, body, article_id };

  checkArticleExists(article_id)
    .then(() => insertComment(newComment))
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const votes = { article_id, inc_votes };

  updateArticleVotes(votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({users})
  }).catch(next)
};
