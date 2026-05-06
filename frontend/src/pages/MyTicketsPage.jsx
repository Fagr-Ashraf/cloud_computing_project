import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InlineError from '../components/InlineError.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { listTickets } from '../services/ticketService';
import { formatDate } from '../utils/format';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await listTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0 }}>My Tickets</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            Only your own tickets are returned for USER role.
          </p>
        </div>
        <div className="row">
          <Link className="btn primary" to="/user/tickets/new">
            Create Ticket
          </Link>
          <button className="btn" onClick={load} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      <InlineError error={error} />

      {loading ? (
        <div className="loading" style={{ marginTop: 12 }}>
          Loading…
        </div>
      ) : tickets.length === 0 ? (
        <div className="muted" style={{ marginTop: 12 }}>
          No tickets yet.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Owner Admin</th>
                <th>Priority</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id}>
                  <td>
                    <Link to={`/user/tickets/${t._id}`}>{t.title}</Link>
                    <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                      {t._id}
                    </div>
                  </td>
                  <td>
                    <StatusPill status={t.status} />
                  </td>
                  <td className="muted">{t.agentName || '-'}</td>
                  <td className="muted">{t.priority || 'low'}</td>
                  <td className="muted">{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

