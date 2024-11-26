const express = require("express");
const { getApi, getTopics, getArticles, getAllArticles, getComments } = require("./nc_controllers/app.controller");
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


app.all("*", (req, res) => {
  res.status(404).send({ message: "not found" });
});
app.use(psqlErrorHandler);

app.use(customErrorHandler);
module.exports = app;
