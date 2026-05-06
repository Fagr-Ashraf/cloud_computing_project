export default function DashboardPage() {
  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p className="muted">
        Use the navigation above to manage tickets, support workflows, notifications, and reports.
      </p>
      <div className="grid2" style={{ marginTop: 12 }}>
        <div className="card">
          <h3>Tickets</h3>
          <p className="muted">Create tickets, browse all tickets, and update ticket status.</p>
        </div>
        <div className="card">
          <h3>Support</h3>
          <p className="muted">
            Assign tickets to agents, add responses, and resolve tickets (syncs with ticket-service).
          </p>
        </div>
        <div className="card">
          <h3>Reports</h3>
          <p className="muted">View totals and status breakdown from reporting-service.</p>
        </div>
        <div className="card">
          <h3>Notifications</h3>
          <p className="muted">Send a test notification message via notification-service.</p>
        </div>
      </div>
    </div>
  );
}

