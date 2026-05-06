const axios = require('axios');

function createNotificationClient(baseURL) {
  const client = axios.create({
    baseURL,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' }
  });

  return {
    async notify(payload, serviceToken) {
      const res = await client.post('/notify', payload, {
        headers: serviceToken ? { 'x-service-token': serviceToken } : undefined
      });
      return res.data;
    }
  };
}

module.exports = { createNotificationClient };

