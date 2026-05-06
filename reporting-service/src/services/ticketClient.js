const axios = require('axios');

function createTicketClient(baseURL) {
  const client = axios.create({
    baseURL,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' }
  });

  return {
    async listTickets(token) {
      const res = await client.get('/tickets', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      return res.data;
    }
  };
}

module.exports = { createTicketClient };

