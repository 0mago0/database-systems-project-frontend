// Load environment variables
require('dotenv').config();

// Dependencies
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');

// Configuration
const config = require('./config');

// Database
const db = require('./util/database');

// Middleware
const { corsOptions, customCorsHeaders } = require('./middleware/cors');

// Routes
var sellerRouter = require('./routes/seller');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

// Express App
var app = express();



// ===== Middleware Setup (Order matters!) =====

// Logging
app.use(logger('dev'));

// Body Parser
app.use(express.json({ limit: config.bodyParserLimit }));
app.use(express.urlencoded({ limit: config.bodyParserLimit, extended: true }));

// CORS
app.use(cors(corsOptions));
app.use(customCorsHeaders);

// ===== Routes =====
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/seller', sellerRouter);
app.use('/admin', adminRouter);

// ===== Error Handling Middleware =====
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ===== Start Server =====
const debug = require('debug')('my-application');

const server = app.listen(config.port, () => {
  console.log(`✓ Server is running on port ${config.port}`);
  console.log(`✓ Environment: ${config.nodeEnv}`);
  debug(`Express server listening on port ${config.port}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
