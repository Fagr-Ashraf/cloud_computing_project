const express = require('express');

function buildRoutes(controller) {
  const router = express.Router();
  router.get('/report', controller.getReport);
  return router;
}

module.exports = { buildRoutes };

