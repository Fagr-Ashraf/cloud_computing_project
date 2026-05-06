const reportService = require('../services/reportService');

function normalizeUpstreamAxiosError(err) {
  const status = err?.response?.status;
  if (!status) return null;

  const message =
    (typeof err?.response?.data?.error === 'string' && err.response.data.error) ||
    (typeof err?.response?.data?.message === 'string' && err.response.data.message) ||
    err.message ||
    'Upstream service error';

  const e = new Error(message);
  e.statusCode = status;
  return e;
}

function createController({ ticketClient }) {
  return {
    async getReport(req, res) {
      let tickets;
      try {
        const token = (req.headers.authorization || '').split(' ')[1];
        tickets = await ticketClient.listTickets(token);
      } catch (err) {
        throw normalizeUpstreamAxiosError(err) || err;
      }
      const report = reportService.computeReport(Array.isArray(tickets) ? tickets : []);
      return res.json(report);
    }
  };
}

module.exports = { createController };

