const ticketService = require('../services/ticketService');

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

async function createTicket(req, res) {
  const { title, description } = req.body || {};
  if (!title) return badRequest(res, 'title is required');
  if (!description) return badRequest(res, 'description is required');

  const createdBy = req.user?.userId;
  const ticket = await ticketService.createTicket({ title, description, createdBy });
  return res.status(201).json(ticket);
}

async function listTickets(req, res) {
  const tickets = await ticketService.listTickets({ user: req.user });
  return res.json(tickets);
}

async function getTicket(req, res) {
  const { id } = req.params;
  const ticket = await ticketService.getTicketById(id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  if (req.user?.role !== 'ADMIN' && String(ticket.createdBy) !== String(req.user?.userId)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  return res.json(ticket);
}

async function updateTicket(req, res) {
  const { id } = req.params;
  const { title, description, status, priority } = req.body || {};

  if (status !== undefined && !['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
    return badRequest(res, 'status must be one of: open, in-progress, resolved');
  }
  if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
    return badRequest(res, 'priority must be one of: low, medium, high');
  }

  const existing = await ticketService.getTicketById(id);
  if (!existing) return res.status(404).json({ error: 'Ticket not found' });

  // USER can only update own ticket; ADMIN can manage all tickets.
  if (req.user?.role !== 'ADMIN' && String(existing.createdBy) !== String(req.user?.userId)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // USER cannot set priority or status to resolved/in-progress (admin workflow only).
  const isAdmin = req.user?.role === 'ADMIN';
  if (!isAdmin && (priority !== undefined || (status && status !== 'open'))) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const ticket = await ticketService.updateTicketById(id, { title, description, status, priority });
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  return res.json(ticket);
}

module.exports = {
  createTicket,
  listTickets,
  getTicket,
  updateTicket
};

