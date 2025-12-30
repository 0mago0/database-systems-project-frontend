require('dotenv').config();

module.exports = {
  // Server Configuration
  port: process.env.PORT || 3002,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration (PostgreSQL)
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'animate_dp',
    port: process.env.DB_PORT || 5432,
    max: 10, // Connection pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  },
  
  // JWT Configuration
  secretKey: process.env.SECRET_KEY || 'DEMO',
  
  // CORS Configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  
  // Body Parser Limits
  bodyParserLimit: '5000mb'
};
