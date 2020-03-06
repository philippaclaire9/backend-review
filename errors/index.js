exports.handles404s = (req, res, next) => {
  res.status(404).send({ msg: "Sorry, path not found!" });
};

exports.handles405s = (req, res, next) => {
  res.status(405).send({ msg: "Sorry, method not allowed!" });
};

exports.handles400s = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "42703") {
    res.status(400).send({ msg: "Sorry, Bad Request!" });
  } else next(err);
};

exports.handles422s = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(422).send({ msg: "Sorry, unprocessable entity!" });
  } else next(err);
};

exports.handlesStatusErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handles500s = (err, req, res, next) => {
  res.status(500).send({ msg: "oh dear, internal server error" });
};
