const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('../controllers/authController');
const env = require('../config/env');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

router.post('/tickets', authRequired(env.jwtSecret), ticketController.createTicket);
router.get('/tickets', authRequired(env.jwtSecret), ticketController.listTickets);
router.get('/tickets/:id', authRequired(env.jwtSecret), ticketController.getTicket);
router.put('/tickets/:id', authRequired(env.jwtSecret), ticketController.updateTicket);

module.exports = router;

