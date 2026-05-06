import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  return (
    <div className="card">
      <h2>Admin Dashboard</h2>
      <p className="muted">Manage all tickets, respond/resolve, set priority, and view reports.</p>
      <div className="row" style={{ marginTop: 12 }}>
        <Link className="btn primary" to="/admin/tickets">
          All Tickets
        </Link>
        <Link className="btn" to="/admin/reports">
          Reporting
        </Link>
      </div>
    </div>
  );
}

