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
  ticketServiceUrl: requireEnv('TICKET_SERVICE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  logFormat: process.env.LOG_FORMAT || 'combined'
};

