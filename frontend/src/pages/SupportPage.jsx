import { useMemo, useState } from 'react';
import InlineError from '../components/InlineError.jsx';
import { assignTicket, respondToTicket, resolveTicket } from '../services/supportService';

export default function SupportPage() {
  const [error, setError] = useState(null);

  const [ticketId, setTicketId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignResult, setAssignResult] = useState(null);

  const [responseTicketId, setResponseTicketId] = useState('');
  const [responseText, setResponseText] = useState('');
  const [responding, setResponding] = useState(false);
  const [respondResult, setRespondResult] = useState(null);

  const [resolveId, setResolveId] = useState('');
  const [resolving, setResolving] = useState(false);
  const [resolveResult, setResolveResult] = useState(null);

  const canAssign = useMemo(() => ticketId.trim() && agentName.trim(), [ticketId, agentName]);
  const canRespond = useMemo(
    () => responseTicketId.trim() && responseText.trim(),
    [responseTicketId, responseText]
  );
  const canResolve = useMemo(() => resolveId.trim(), [resolveId]);

  async function onAssign(e) {
    e.preventDefault();
    if (!canAssign) return;
    setError(null);
    setAssignResult(null);
    setAssigning(true);
    try {
      const data = await assignTicket({ ticketId: ticketId.trim(), agentName: agentName.trim() });
      setAssignResult(data);
    } catch (e2) {
      setError(e2);
    } finally {
      setAssigning(false);
    }
  }

  async function onRespond(e) {
    e.preventDefault();
    if (!canRespond) return;
    setError(null);
    setRespondResult(null);
    setResponding(true);
    try {
      const data = await respondToTicket({ ticketId: responseTicketId.trim(), response: responseText.trim() });
      setRespondResult(data);
    } catch (e2) {
      setError(e2);
    } finally {
      setResponding(false);
    }
  }

  async function onResolve(e) {
    e.preventDefault();
    if (!canResolve) return;
    setError(null);
    setResolveResult(null);
    setResolving(true);
    try {
      const data = await resolveTicket(resolveId.trim());
      setResolveResult(data);
    } catch (e2) {
      setError(e2);
    } finally {
      setResolving(false);
    }
  }

  return (
    <div className="card">
      <h2>Support</h2>
      <p className="muted">
        Uses support-service endpoints and syncs ticket status with ticket-service.
      </p>
      <InlineError error={error} />

      <div className="grid2" style={{ marginTop: 12 }}>
        <div className="card">
          <h3>Assign ticket (POST /assign)</h3>
          <form onSubmit={onAssign}>
            <div className="field">
              <label>Ticket ID</label>
              <input value={ticketId} onChange={(e) => setTicketId(e.target.value)} placeholder="Ticket _id" />
            </div>
            <div className="field">
              <label>Agent name</label>
              <input value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <button className="btn primary" disabled={!canAssign || assigning}>
              {assigning ? 'Assigning…' : 'Assign'}
            </button>
          </form>
          {assignResult ? (
            <pre className="card" style={{ marginTop: 12, overflowX: 'auto' }}>
              {JSON.stringify(assignResult, null, 2)}
            </pre>
          ) : null}
        </div>

        <div className="card">
          <h3>Add response (POST /respond)</h3>
          <form onSubmit={onRespond}>
            <div className="field">
              <label>Ticket ID</label>
              <input
                value={responseTicketId}
                onChange={(e) => setResponseTicketId(e.target.value)}
                placeholder="Ticket _id"
              />
            </div>
            <div className="field">
              <label>Response</label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write the support response"
              />
            </div>
            <button className="btn primary" disabled={!canRespond || responding}>
              {responding ? 'Sending…' : 'Send Response'}
            </button>
          </form>
          {respondResult ? (
            <pre className="card" style={{ marginTop: 12, overflowX: 'auto' }}>
              {JSON.stringify(respondResult, null, 2)}
            </pre>
          ) : null}
        </div>

        <div className="card">
          <h3>Resolve ticket (PUT /resolve/:ticketId)</h3>
          <form onSubmit={onResolve}>
            <div className="field">
              <label>Ticket ID</label>
              <input value={resolveId} onChange={(e) => setResolveId(e.target.value)} placeholder="Ticket _id" />
            </div>
            <button className="btn primary" disabled={!canResolve || resolving}>
              {resolving ? 'Resolving…' : 'Resolve'}
            </button>
          </form>
          {resolveResult ? (
            <pre className="card" style={{ marginTop: 12, overflowX: 'auto' }}>
              {JSON.stringify(resolveResult, null, 2)}
            </pre>
          ) : null}
        </div>

        <div className="card">
          <h3>Tips</h3>
          <ul className="muted" style={{ margin: 0, paddingLeft: 18 }}>
            <li>Start by creating a ticket in the Tickets page.</li>
            <li>Copy its <strong>_id</strong> and paste into the forms here.</li>
            <li>Assign/responses will set ticket status to <strong>in-progress</strong>.</li>
            <li>Resolve will set ticket status to <strong>closed</strong>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

