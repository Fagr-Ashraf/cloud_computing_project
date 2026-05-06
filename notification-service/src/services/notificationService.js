const Notification = require('../models/Notification');

async function sendNotification({ message, ticketId, userId }) {
  console.log(`[notification-service] userId=${userId || ''} ticketId=${ticketId || ''} message=${message}`);

  if (userId) {
    const doc = await Notification.create({
      userId: String(userId),
      ticketId: ticketId ? String(ticketId) : '',
      message: String(message)
    });
    return doc.toObject();
  }

  // Backward compatible behavior (no persistence if userId not provided)
  return { message };
}

async function listNotificationsForUser(userId) {
  const docs = await Notification.find({ userId: String(userId) }).sort({ createdAt: -1 }).lean();
  return docs;
}

module.exports = { sendNotification, listNotificationsForUser };

