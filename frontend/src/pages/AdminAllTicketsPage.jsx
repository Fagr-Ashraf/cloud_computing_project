import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InlineError from '../components/InlineError.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { listTickets } from '../services/ticketService';
import { formatDate } from '../utils/format';

export default function AdminAllTicketsPage() {
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
          <h2 style={{ margin: 0 }}>All Tickets</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            ADMIN sees all tickets (GET /tickets).
          </p>
        </div>
        <button className="btn" onClick={load} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
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
                <th>CreatedBy</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id}>
                  <td>
                    <Link to={`/admin/tickets/${t._id}/manage`}>{t.title}</Link>
                    <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                      {t._id}
                    </div>
                  </td>
                  <td>
                    <StatusPill status={t.status} />
                  </td>
                  <td className="muted">{t.agentName || '-'}</td>
                  <td className="muted">{t.priority || 'low'}</td>
                  <td className="muted">{t.createdBy || '-'}</td>
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

