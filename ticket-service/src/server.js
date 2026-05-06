const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const { connectToMongo } = require('./config/db');
const env = require('./config/env');
const ticketRoutes = require('./routes/ticketRoutes');

async function start() {
  await connectToMongo(env.mongoUri);

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.logFormat));

  app.get('/health', async (req, res) => {
    res.json({ ok: true, service: 'ticket-service' });
  });

  app.use(ticketRoutes);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
    const message = status >= 500 ? 'Internal Server Error' : err.message;
    res.status(status).json({ error: message });
  });

  app.listen(Number(env.port), () => {
    // Intentionally minimal log; do not leak config.
    console.log(`ticket-service listening on port ${env.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start ticket-service', err);
  process.exit(1);
});

