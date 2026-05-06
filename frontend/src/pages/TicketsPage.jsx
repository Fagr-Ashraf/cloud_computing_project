import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import InlineError from '../components/InlineError.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { createTicket, listTickets } from '../services/ticketService';
import { formatDate } from '../utils/format';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const canCreate = useMemo(() => title.trim() && description.trim(), [title, description]);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const data = await listTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    if (!canCreate) return;
    setError(null);
    setCreating(true);
    try {
      await createTicket({ title, description });
      setTitle('');
      setDescription('');
      await refresh();
    } catch (e2) {
      setError(e2);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="grid2">
      <div className="card">
        <h2>Tickets</h2>
        <p className="muted">Create a new ticket (POST /tickets).</p>
        <InlineError error={error} />

        <form onSubmit={onCreate} style={{ marginTop: 12 }}>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title" />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue"
            />
          </div>
          <div className="row">
            <button className="btn primary" disabled={!canCreate || creating}>
              {creating ? 'Creating…' : 'Create Ticket'}
            </button>
            <button type="button" className="btn" onClick={refresh} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>All tickets</h2>
          <span className="muted">{tickets.length} total</span>
        </div>

        {loading ? (
          <div className="loading" style={{ marginTop: 12 }}>
            Loading tickets…
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
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <Link to={`/tickets/${t._id}`}>{t.title}</Link>
                      <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                        {String(t._id)}
                      </div>
                    </td>
                    <td>
                      <StatusPill status={t.status} />
                    </td>
                    <td className="muted">{formatDate(t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

