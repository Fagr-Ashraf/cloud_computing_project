import { statusClass } from '../utils/format';

export default function StatusPill({ status }) {
  const cls = statusClass(status);
  return <span className={`pill ${cls}`}>{status || 'unknown'}</span>;
}

