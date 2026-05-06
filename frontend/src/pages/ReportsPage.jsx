import { useEffect, useState } from 'react';
import InlineError from '../components/InlineError.jsx';
import { getReport } from '../services/reportService';

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await getReport();
      setReport(data);
    } catch (e) {
      setError(e);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0 }}>Reports</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            From reporting-service (GET /report).
          </p>
        </div>
        <button className="btn" onClick={load} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <InlineError error={error} />

      {loading ? (
        <div className="loading" style={{ marginTop: 12 }}>
          Loading report…
        </div>
      ) : !report ? (
        <div className="muted" style={{ marginTop: 12 }}>
          No report loaded.
        </div>
      ) : (
        <div className="grid2" style={{ marginTop: 12 }}>
          <div className="card">
            <h3>Total tickets</h3>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{report.totalTickets ?? 0}</div>
          </div>
          <div className="card">
            <h3>Open tickets</h3>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{report.openTickets ?? 0}</div>
          </div>
          <div className="card">
            <h3>In-progress tickets</h3>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{report.inProgressTickets ?? 0}</div>
          </div>
          <div className="card">
            <h3>Closed tickets</h3>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{report.closedTickets ?? 0}</div>
          </div>
          <div className="card">
            <h3>Raw JSON</h3>
            <pre style={{ margin: 0, overflowX: 'auto' }}>{JSON.stringify(report, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

