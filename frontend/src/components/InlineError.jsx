export default function InlineError({ error }) {
  if (!error) return null;
  return <div className="error">{String(error.message || error)}</div>;
}

