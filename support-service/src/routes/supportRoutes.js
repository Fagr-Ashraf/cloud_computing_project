const express = require('express');

function buildRoutes(controller) {
  const router = express.Router();

  router.get('/support/:ticketId', controller.getInteraction);
  router.post('/assign', controller.assign);
  router.post('/respond', controller.respond);
  router.put('/resolve/:ticketId', controller.resolve);

  return router;
}

module.exports = { buildRoutes };

