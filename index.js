/*eslint-disable strict */
'use strict';

require('dotenv').config();
const server = require('./lib/server.js');
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lab11';

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(MONGODB_URI, options);

server.start(process.env.PORT);