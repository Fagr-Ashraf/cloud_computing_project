const Ticket = require('../models/Ticket');

function normalizeStatus(status) {
  if (status === 'closed') return 'resolved';
  return status;
}

async function createTicket({ title, description, createdBy }) {
  const ticket = await Ticket.create({ title, description, createdBy });
  return ticket;
}

async function listTickets({ user }) {
  const filter = user?.role === 'ADMIN' ? {} : { createdBy: user.userId };
  const tickets = await Ticket.find(filter).sort({ createdAt: -1 }).lean();
  return tickets;
}

async function getTicketById(id) {
  const ticket = await Ticket.findById(id).lean();
  return ticket;
}

async function updateTicketById(id, updates) {
  const allowed = {};
  if (updates.title !== undefined) allowed.title = updates.title;
  if (updates.description !== undefined) allowed.description = updates.description;
  if (updates.status !== undefined) allowed.status = normalizeStatus(updates.status);
  if (updates.priority !== undefined) allowed.priority = updates.priority;
  if (updates.agentName !== undefined) allowed.agentName = updates.agentName;

  const ticket = await Ticket.findByIdAndUpdate(id, allowed, {
    new: true,
    runValidators: true
  }).lean();

  return ticket;
}

module.exports = {
  createTicket,
  listTickets,
  getTicketById,
  updateTicketById,
  normalizeStatus
};

