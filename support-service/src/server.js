const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const { connectToMongo } = require('./config/db');
const env = require('./config/env');
const { createTicketClient } = require('./services/ticketClient');
const { createNotificationClient } = require('./services/notificationClient');
const { createController } = require('./controllers/supportController');
const { buildRoutes } = require('./routes/supportRoutes');
const { authRequired, requireRole } = require('./middleware/auth');

async function start() {
  await connectToMongo(env.mongoUri);

  const ticketClient = createTicketClient(env.ticketServiceUrl);
  const notificationClient = createNotificationClient(env.notificationServiceUrl);
  const controller = createController({
    ticketClient,
    notificationClient,
    notificationServiceToken: env.notificationServiceToken
  });

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.logFormat));

  app.get('/health', async (req, res) => {
    res.json({ ok: true, service: 'support-service' });
  });

  app.use(authRequired(env.jwtSecret), requireRole('ADMIN'), buildRoutes(controller));

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);

    const status =
      err.statusCode && Number.isInteger(err.statusCode)
        ? err.statusCode
        : 500;

    res.status(status).json({
      error: err.message || 'Internal Server Error',
      stack: err.stack
    });
  });;

  app.listen(Number(env.port), () => {
    console.log(`support-service listening on port ${env.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start support-service', err);
  process.exit(1);
});

