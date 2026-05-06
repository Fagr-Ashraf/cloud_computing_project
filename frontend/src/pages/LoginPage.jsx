import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InlineError from '../components/InlineError.jsx';
import { login } from '../services/authService';
import { setToken } from '../utils/auth';

export default function LoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = useMemo(() => username.trim() && password, [username, password]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const result = await login({ username: username.trim(), password });
      setToken(result.token);
      const role = result?.user?.role;
      nav(role === 'ADMIN' ? '/admin' : '/user', { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h2>Login</h2>
      <p className="muted">JWT login (ticket-service).</p>
      <InlineError error={error} />

      <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
        <div className="field">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
          />
        </div>
        <div className="row">
          <button className="btn primary" disabled={!canSubmit || loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
          <Link className="btn" to="/register">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

