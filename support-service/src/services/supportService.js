const Support = require('../models/Support');

async function assignTicket({ ticketId, agentName, priority }) {
  const doc = await Support.findOneAndUpdate(
    { ticketId },
    {
      $setOnInsert: {
        ticketId,
        responses: [],
        status: 'in-progress'
      },

      $set: {
        agentName,
        priority: priority || 'low'
      }
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  ).lean();

  return doc;
}

async function addResponse({ ticketId, message, agentName }) {
  const doc = await Support.findOneAndUpdate(
    { ticketId },
    {
      $set: { agentName },

      $push: {
        responses: {
          message,
          timestamp: new Date()
        }
      }
    },
    { new: true }
  ).lean();

  return doc;
}

async function resolveTicket(ticketId, agentName) {
  const doc = await Support.findOneAndUpdate(
    { ticketId },
    {
      $set: {
        status: 'resolved',
        agentName
      }
    },
    { new: true }
  ).lean();

  return doc;
}

async function getSupportByTicketId(ticketId) {
  const doc = await Support.findOne({ ticketId }).lean();

  return doc;
}

module.exports = {
  assignTicket,
  addResponse,
  resolveTicket,
  getSupportByTicketId
};