import { useMemo, useState } from 'react';
import InlineError from '../components/InlineError.jsx';
import { notify } from '../services/notificationService';

export default function NotificationsPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const canSend = useMemo(() => message.trim(), [message]);

  async function onSend(e) {
    e.preventDefault();
    if (!canSend) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await notify({ message: message.trim() });
      setResult(data);
    } catch (e2) {
      setError(e2);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid2">
      <div className="card">
        <h2>Notifications</h2>
        <p className="muted">Send a message (POST /notify).</p>
        <InlineError error={error} />

        <form onSubmit={onSend} style={{ marginTop: 12 }}>
          <div className="field">
            <label>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hello from the frontend"
            />
          </div>
          <button className="btn primary" disabled={!canSend || loading}>
            {loading ? 'Sending…' : 'Send Notification'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Response</h2>
        {result ? (
          <pre style={{ margin: 0, overflowX: 'auto' }}>{JSON.stringify(result, null, 2)}</pre>
        ) : (
          <div className="muted">No response yet.</div>
        )}
      </div>
    </div>
  );
}

