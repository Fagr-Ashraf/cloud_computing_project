import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InlineError from '../components/InlineError.jsx';
import { register } from '../services/authService';

export default function RegisterPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const canSubmit = useMemo(() => username.trim() && password.length >= 6, [username, password]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      await register({ username: username.trim(), password, role });
      setDone(true);
      setTimeout(() => nav('/login', { replace: true }), 400);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h2>Register</h2>
      <p className="muted">Creates a user in ticket-service.</p>
      <InlineError error={error} />
      {done ? <div className="card">Registered. Redirecting to login…</div> : null}

      <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
        <div className="field">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        </div>
        <div className="field">
          <label>Password (min 6)</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
          />
        </div>
        <div className="field">
          <label>Role (dev)</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div className="row">
          <button className="btn primary" disabled={!canSubmit || loading}>
            {loading ? 'Creating…' : 'Register'}
          </button>
          <Link className="btn" to="/login">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}

