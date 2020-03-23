const express = require('express');
const cors = require('cors');

const apiRouter = require('./routes/api');
const {
  handles404s,
  handles400s,
  handles422s,
  handlesStatusErrors,
  handles500s,
  handles405s
} = require('./errors');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', handles404s);

app.use(handles400s);

app.use(handles422s);

app.use(handlesStatusErrors);

app.use(handles500s);

app.use(handles405s);

module.exports = app;
