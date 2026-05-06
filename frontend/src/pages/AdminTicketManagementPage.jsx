import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import InlineError from '../components/InlineError.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { getTicket } from '../services/ticketService';
import { formatDate } from '../utils/format';
import { getInteraction, resolve, respond } from '../services/adminSupportService';

export default function AdminTicketManagementPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [interaction, setInteraction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('low');
  const [status, setStatus] = useState('in-progress');

  const canRespond = useMemo(() => message.trim(), [message]);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const t = await getTicket(id);
      setTicket(t);
      setPriority(t.priority || 'low');

      try {
        const it = await getInteraction(id);
        setInteraction(it);
      } catch {
        setInteraction(null);
      }
    } catch (err) {
      setError(err);
      setTicket(null);
      setInteraction(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function onRespond(e) {
    e.preventDefault();
    if (!canRespond) return;
    setError(null);
    setSaving(true);
    try {
      await respond(id, { message: message.trim(), status, priority });
      setMessage('');
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onResolve() {
    setError(null);
    setSaving(true);
    try {
      await resolve(id);
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0 }}>Ticket Management</h2>
          <div className="muted" style={{ marginTop: 6 }}>
            <Link to="/admin/tickets">← Back to All Tickets</Link>
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
        <div className="grid2" style={{ marginTop: 12 }}>
          <div className="card">
            <h3>Ticket</h3>
            <div className="muted">
              <div>
                <strong>ID:</strong> {ticket._id}
              </div>
              <div>
                <strong>Created:</strong> {formatDate(ticket.createdAt)}
              </div>
              <div>
                <strong>createdBy:</strong> {ticket.createdBy}
              </div>
              <div>
                <strong>agentName:</strong> {ticket.agentName || '-'}
              </div>
              <div>
                <strong>priority:</strong> {ticket.priority || 'low'}
              </div>
            </div>
            <h3 style={{ marginTop: 12 }}>{ticket.title}</h3>
            <p className="muted" style={{ whiteSpace: 'pre-wrap' }}>
              {ticket.description}
            </p>

            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn" onClick={load} disabled={loading}>
                Reload
              </button>
              <button className="btn primary" onClick={onResolve} disabled={saving}>
                {saving ? 'Working…' : 'Resolve (PUT /resolve/:ticketId)'}
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Respond / set priority</h3>
            <form onSubmit={onRespond}>
              <div className="grid2">
                <div className="field">
                  <label>Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </div>
                <div className="field">
                  <label>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="in-progress">in-progress</option>
                    <option value="resolved">resolved</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Response message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write update to user" />
              </div>
              <button className="btn primary" disabled={!canRespond || saving}>
                {saving ? 'Sending…' : 'Send Response (POST /respond)'}
              </button>
            </form>

            <h3 style={{ marginTop: 14 }}>Interaction history</h3>
            {!interaction ? (
              <div className="muted">No support record yet (assign/respond will create it).</div>
            ) : interaction.responses?.length ? (
              <div style={{ display: 'grid', gap: 10 }}>
                {interaction.responses.map((r, idx) => (
                  <div key={idx} className="card">
                    <div className="muted" style={{ fontSize: 12 }}>
                      {new Date(r.timestamp).toLocaleString()}
                    </div>
                    <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{r.message}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="muted">No responses yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

