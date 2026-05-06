const axios = require('axios');

function createTicketClient(baseURL) {
  const client = axios.create({
    baseURL,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' }
  });

  return {
    async updateTicket(ticketId, payload, token) {
      await client.put(`/tickets/${ticketId}`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
    },
    async getTicket(ticketId, token) {
      const res = await client.get(`/tickets/${ticketId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      return res.data;
    }
  };
}

module.exports = { createTicketClient };

