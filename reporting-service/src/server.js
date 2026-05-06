const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const env = require('./config/env');
const { createTicketClient } = require('./services/ticketClient');
const { createController } = require('./controllers/reportController');
const { buildRoutes } = require('./routes/reportRoutes');
const { authRequired, requireRole } = require('./middleware/auth');

async function start() {
  const app = express();

  const ticketClient = createTicketClient(env.ticketServiceUrl);
  const controller = createController({ ticketClient });

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.logFormat));

  app.get('/health', async (req, res) => {
    res.json({ ok: true, service: 'reporting-service' });
  });

  app.use(authRequired(env.jwtSecret), requireRole('ADMIN'), buildRoutes(controller));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
    const message = status >= 500 ? 'Internal Server Error' : err.message;
    res.status(status).json({ error: message });
  });

  app.listen(Number(env.port), () => {
    console.log(`reporting-service listening on port ${env.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start reporting-service', err);
  process.exit(1);
});

