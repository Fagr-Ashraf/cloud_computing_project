import { Link } from 'react-router-dom';

export default function UserDashboardPage() {
  return (
    <div className="card">
      <h2>User Dashboard</h2>
      <p className="muted">Create and track your own tickets, and view notifications.</p>
      <div className="row" style={{ marginTop: 12 }}>
        <Link className="btn primary" to="/user/tickets/new">
          Create Ticket
        </Link>
        <Link className="btn" to="/user/tickets">
          My Tickets
        </Link>
        <Link className="btn" to="/user/notifications">
          Notifications
        </Link>
      </div>
    </div>
  );
}

