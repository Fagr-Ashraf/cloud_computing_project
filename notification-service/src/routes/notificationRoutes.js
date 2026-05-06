const express = require('express');
const notificationController = require('../controllers/notificationController');
const env = require('../config/env');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/notify', notificationController.notify);
router.get('/notifications/my', authRequired(env.jwtSecret), requireRole('USER', 'ADMIN'), notificationController.myNotifications);

module.exports = router;

