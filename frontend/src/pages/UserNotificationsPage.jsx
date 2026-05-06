import { useEffect, useState } from 'react';
import InlineError from '../components/InlineError.jsx';
import { createHttp } from '../services/http';
import { formatDate } from '../utils/format';

const http = createHttp('http://localhost:5003');

export default function UserNotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await http.get('/notifications/my');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err);
      setItems([]);
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
          <h2 style={{ margin: 0 }}>Notifications</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            Event-driven notifications when an admin responds to your ticket.
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
      ) : items.length === 0 ? (
        <div className="muted" style={{ marginTop: 12 }}>
          No notifications yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {items.map((n) => (
            <div key={n._id} className="card">
              <div className="muted" style={{ fontSize: 12 }}>
                {formatDate(n.createdAt)} • ticket {n.ticketId || '-'}
              </div>
              <div style={{ marginTop: 6 }}>{n.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

