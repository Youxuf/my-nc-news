const express = require("express");
const { getApi, getTopics } = require("./nc_controllers/app.controller");
const {
  psqlErrorHandler,
  customErrorHandler,
} = require("./nc models/error-handler");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);
app.all("*", (req, res) => {
  res.status(404).send({ message: "not found" });
});
app.use(psqlErrorHandler);

app.use(customErrorHandler);
module.exports = app;
