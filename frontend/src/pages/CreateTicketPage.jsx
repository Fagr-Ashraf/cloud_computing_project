import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InlineError from '../components/InlineError.jsx';
import { createTicket } from '../services/ticketService';

export default function CreateTicketPage() {
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canCreate = useMemo(() => title.trim() && description.trim(), [title, description]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canCreate) return;
    setError(null);
    setLoading(true);
    try {
      const t = await createTicket({ title, description });
      nav(`/user/tickets/${t._id}`, { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 740, margin: '0 auto' }}>
      <h2>Create Ticket</h2>
      <InlineError error={error} />
      <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
        <div className="field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title" />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue" />
        </div>
        <button className="btn primary" disabled={!canCreate || loading}>
          {loading ? 'Creating…' : 'Create'}
        </button>
      </form>
    </div>
  );
}

