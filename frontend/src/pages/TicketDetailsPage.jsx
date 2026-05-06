import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import InlineError from '../components/InlineError.jsx';
import StatusPill from '../components/StatusPill.jsx';

import { getTicket, updateTicket } from '../services/ticketService';

import {
  assignTicket,
  respondToTicket,
  resolveTicket
} from '../services/supportService';

import { formatDate } from '../utils/format';

export default function TicketDetailsPage() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('open');

  const [responseMessage, setResponseMessage] = useState('');
  const [agentName, setAgentName] = useState('');

  const canSave = useMemo(() => {
    return title.trim() && description.trim() && status;
  }, [title, description, status]);

  async function load() {
    setError(null);
    setLoading(true);

    try {
      const data = await getTicket(id);

      setTicket(data);

      setTitle(data?.title || '');
      setDescription(data?.description || '');
      setStatus(data?.status || 'open');
    } catch (e) {
      setError(e);
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function onSave(e) {
    e.preventDefault();

    if (!canSave) return;

    setSaving(true);
    setError(null);

    try {
      const updated = await updateTicket(id, {
        title,
        description,
        status
      });

      setTicket(updated);
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  }

  async function onAssign() {
    try {
      setError(null);

     await assignTicket({
      ticketId: id,
      priority: 'medium',
      agentName
    });

      alert('Ticket assigned successfully');
    } catch (e) {
      setError(e);
    }
  }

  async function onRespond() {
    try {
      setError(null);

      await respondToTicket({
        ticketId: id,
        response: responseMessage,
        status: 'in-progress'
      });

      alert('Response sent');

      setResponseMessage('');
    } catch (e) {
      setError(e);
    }
  }

  async function onResolve() {
    try {
      setError(null);

      await resolveTicket(id);

      alert('Ticket resolved');

      load();
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0 }}>Ticket details</h2>

          <div className="muted" style={{ marginTop: 6 }}>
            <Link to="/tickets">← Back to tickets</Link>
          </div>
        </div>

        {ticket?.status ? (
          <StatusPill status={ticket.status} />
        ) : null}
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
        <>
          <div className="muted" style={{ marginTop: 10 }}>
            <div>
              <strong>ID:</strong> {ticket._id}
            </div>

            <div>
              <strong>Created:</strong> {formatDate(ticket.createdAt)}
            </div>
          </div>

          <form onSubmit={onSave} style={{ marginTop: 14 }}>
            <div className="grid2">
              <div className="field">
                <label>Title</label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Status</label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="open">open</option>
                  <option value="in-progress">in-progress</option>
                  <option value="closed">closed</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Description</label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="row">
              <button
                className="btn primary"
                disabled={!canSave || saving}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>

              <button
                type="button"
                className="btn"
                onClick={load}
                disabled={loading}
              >
                Reload
              </button>
            </div>
          </form>

          <hr style={{ margin: '20px 0' }} />

          <div className="field" style={{ marginTop: 20 }}>
            <label>Assign Agent</label>

            <input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter agent name"
            />
          </div>

          <div className="row" style={{ gap: 10 }}>
            <button className="btn primary" onClick={onAssign}>
              Assign Ticket
            </button>

            <button className="btn" onClick={onResolve}>
              Resolve Ticket
            </button>
          </div>

          <div className="field" style={{ marginTop: 20 }}>
            <label>Support Response</label>

            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder="Write response..."
            />
          </div>

          <button className="btn primary" onClick={onRespond}>
            Send Response
          </button>
        </>
      )}
    </div>
  );
}