const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    ticketId: { type: String, default: '', index: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Notification', NotificationSchema);

