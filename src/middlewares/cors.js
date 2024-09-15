
const express = require('express');
const cors = require('cors');
const app = express();

const corsMiddleware = (req, res, next) => {
  app.use(cors({
    origin: 'http://localhost:5173',
  }))

  next();
}

module.exports = corsMiddleware;