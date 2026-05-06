const dotenv = require('dotenv');

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: requireEnv('PORT'),
  mongoUri: requireEnv('MONGODB_URI'),
  logFormat: process.env.LOG_FORMAT || 'combined',
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d'
};

