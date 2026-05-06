const mongoose = require('mongoose');

const SupportSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, index: true },
    agentName: { type: String, required: true, trim: true },
    responses: {
      type: [
        {
          message: { type: String, required: true, trim: true },
          timestamp: { type: Date, default: Date.now }
        }
      ],
      default: []
    },
    status: { type: String, default: 'in-progress' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
  },
  { versionKey: false }
);

//SupportSchema.index({ ticketId: 1 }, { unique: true });

module.exports = mongoose.model('Support', SupportSchema);

