export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString();
}

export function statusClass(status) {
  if (status === 'open') return 'open';
  if (status === 'in-progress') return 'inprogress';
  if (status === 'closed') return 'closed';
  return '';
}

