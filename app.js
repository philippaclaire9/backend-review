const express = require("express");

const apiRouter = require("./routes/api");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Sorry, invalid path!" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Sorry, Bad Request!" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "oh dear, internal server error" });
});

module.exports = app;
