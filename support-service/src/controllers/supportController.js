const supportService = require('../services/supportService');

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

function normalizeUpstreamAxiosError(err) {
  const status = err?.response?.status;

  if (!status) return null;

  const message =
    (typeof err?.response?.data?.error === 'string' &&
      err.response.data.error) ||
    (typeof err?.response?.data?.message === 'string' &&
      err.response.data.message) ||
    err.message ||
    'Upstream service error';

  const e = new Error(message);

  e.statusCode = status;

  return e;
}

function createController({
  ticketClient,
  notificationClient,
  notificationServiceToken
}) {
  return {
    async getInteraction(req, res) {
      const { ticketId } = req.params;

      if (!ticketId) {
        return badRequest(res, 'ticketId is required');
      }

      const doc =
        await supportService.getSupportByTicketId(ticketId);

      if (!doc) {
        return res.status(404).json({
          error: 'Support record not found for ticketId'
        });
      }

      return res.json(doc);
    },

    async assign(req, res) {
      const { ticketId, priority, agentName } =
        req.body || {};

      if (!ticketId) {
        return badRequest(res, 'ticketId is required');
      }

      if (!agentName || !agentName.trim()) {
        return badRequest(res, 'agentName is required');
      }

      if (
        priority !== undefined &&
        !['low', 'medium', 'high'].includes(priority)
      ) {
        return badRequest(
          res,
          'priority must be one of: low, medium, high'
        );
      }

      const token =
        (req.headers.authorization || '').split(' ')[1];

      try {
        await ticketClient.getTicket(ticketId, token);

        await ticketClient.updateTicket(
          ticketId,
          {
            status: 'in-progress',
            agentName: agentName.trim(),
            ...(priority ? { priority } : {})
          },
          token
        );
      } catch (err) {
        throw normalizeUpstreamAxiosError(err) || err;
      }

      const support =
        await supportService.assignTicket({
          ticketId,
          agentName: agentName.trim(),
          priority
        });

      return res.status(201).json(support);
    },

    async respond(req, res) {
      const {
        ticketId,
        response,
        message,
        status,
        priority
      } = req.body || {};

      if (!ticketId) {
        return badRequest(res, 'ticketId is required');
      }

      const msg = message ?? response;

      if (!msg || !String(msg).trim()) {
        return badRequest(res, 'response is required');
      }

      const token =
        (req.headers.authorization || '').split(' ')[1];

      const adminName = req.user?.username;

      if (!adminName) {
        return res.status(401).json({
          error: 'Invalid token payload'
        });
      }

      let existing =
        await supportService.getSupportByTicketId(ticketId);

      if (!existing) {
        existing = await supportService.assignTicket({
          ticketId,
          agentName: adminName,
          priority: priority || 'low'
        });
      }

      const assignedAgent =
        existing.agentName || adminName;

      try {
        const ticket =
          await ticketClient.getTicket(ticketId, token);

        const nextStatus =
          status || 'in-progress';

        await ticketClient.updateTicket(
          ticketId,
          {
            status: nextStatus,
            agentName: assignedAgent,
            ...(priority ? { priority } : {})
          },
          token
        );

        await notificationClient.notify(
          {
            message: `Your ticket was updated by ${assignedAgent}`,
            ticketId,
            userId: String(ticket.createdBy)
          },
          notificationServiceToken
        );
      } catch (err) {
        throw normalizeUpstreamAxiosError(err) || err;
      }

      const support =
        await supportService.addResponse({
          ticketId,
          message: String(msg).trim(),
          agentName: assignedAgent
        });

      return res.json(support);
    },

    async resolve(req, res) {
      const { ticketId } = req.params;

      if (!ticketId) {
        return badRequest(res, 'ticketId is required');
      }

      const token =
        (req.headers.authorization || '').split(' ')[1];

      const adminName = req.user?.username;

      if (!adminName) {
        return res.status(401).json({
          error: 'Invalid token payload'
        });
      }

      let existing =
        await supportService.getSupportByTicketId(ticketId);

      if (!existing) {
        existing = await supportService.assignTicket({
          ticketId,
          agentName: adminName,
          priority: 'low'
        });
      }

      const assignedAgent =
        existing.agentName || adminName;

      try {
        const ticket =
          await ticketClient.getTicket(ticketId, token);

        await ticketClient.updateTicket(
          ticketId,
          {
            status: 'resolved',
            agentName: assignedAgent
          },
          token
        );

        await notificationClient.notify(
          {
            message: `Your ticket was resolved by ${assignedAgent}`,
            ticketId,
            userId: String(ticket.createdBy)
          },
          notificationServiceToken
        );
      } catch (err) {
        throw normalizeUpstreamAxiosError(err) || err;
      }

      const support =
        await supportService.resolveTicket(
          ticketId,
          assignedAgent
        );

      return res.json(support);
    }
  };
}

module.exports = { createController };