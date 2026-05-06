const notificationService = require('../services/notificationService');

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

async function notify(req, res) {
  const { message, ticketId, userId } = req.body || {};
  if (!message) return badRequest(res, 'message is required');

  // Enforce "only support-service triggers" via shared token when configured.
  const expected = req.app.get('serviceToken') || '';
  if (expected) {
    const provided = req.headers['x-service-token'];
    if (provided !== expected) return res.status(403).json({ error: 'Forbidden' });
  }

  await notificationService.sendNotification({ message, ticketId, userId });
  return res.json({
    success: true,
    message: 'User notified successfully',
    data: { ticketId, userId, message }
  });
}

async function myNotifications(req, res) {
  const userIdFromJwt = req.user?.userId;
  const docs = await notificationService.listNotificationsForUser(userIdFromJwt);
  return res.json(docs);
}

module.exports = { notify, myNotifications };

