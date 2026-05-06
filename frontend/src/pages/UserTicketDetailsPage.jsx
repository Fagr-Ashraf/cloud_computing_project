import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import InlineError from '../components/InlineError.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { getTicket } from '../services/ticketService';
import { formatDate } from '../utils/format';

export default function UserTicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await getTicket(id);
      setTicket(data);
    } catch (err) {
      setError(err);
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0 }}>Ticket</h2>
          <div className="muted" style={{ marginTop: 6 }}>
            <Link to="/user/tickets">← Back to My Tickets</Link>
          </div>
        </div>
        {ticket?.status ? <StatusPill status={ticket.status} /> : null}
      </div>

      <InlineError error={error} />

      {loading ? (
        <div className="loading" style={{ marginTop: 12 }}>
          Loading…
        </div>
      ) : !ticket ? (
        <div className="muted" style={{ marginTop: 12 }}>
          Ticket not found.
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <div className="card">
            <div className="muted">
              <div>
                <strong>ID:</strong> {ticket._id}
              </div>
              <div>
                <strong>Created:</strong> {formatDate(ticket.createdAt)}
              </div>
              <div>
                <strong>Priority:</strong> {ticket.priority || 'low'}
              </div>
              <div>
                <strong>Handled by (agentName):</strong> {ticket.agentName || '-'}
              </div>
            </div>
          </div>

          <h3 style={{ marginTop: 14 }}>{ticket.title}</h3>
          <p className="muted" style={{ whiteSpace: 'pre-wrap' }}>
            {ticket.description}
          </p>
        </div>
      )}
    </div>
  );
}

