function computeReport(tickets) {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'in-progress').length;
  const closedTickets = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  return { totalTickets, openTickets, inProgressTickets, closedTickets };
}

module.exports = { computeReport };

