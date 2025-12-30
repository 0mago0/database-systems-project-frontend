const cors = require('cors');
const config = require('../config');

// CORS options
const corsOptions = {
  origin: config.corsOrigin,
  methods: ['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Content-Length', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true
};

// Custom CORS middleware
const customCorsHeaders = (req, res, next) => {
  const originHeader = req.headers.origin;
  res.header('Access-Control-Allow-Origin', originHeader);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', '3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  res.header('Access-Control-Allow-Credentials', true);
  next();
};

module.exports = {
  corsOptions,
  customCorsHeaders
};
