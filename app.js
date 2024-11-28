const express = require("express");
const { getApi, getTopics, getArticles, getAllArticles, getComments, postComment, patchArticleVotes, deleteComment } = require("./nc_controllers/app.controller");
const {
  psqlErrorHandler,
  customErrorHandler,
} = require("./error-handler");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getComments)

app.use(express.json())

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchArticleVotes)

app.delete("/api/comments/:comment_id", deleteComment)

app.all("*", (req, res) => {
  res.status(404).send({ message: "not found" });
});
app.use(psqlErrorHandler);

app.use(customErrorHandler);
module.exports = app;
