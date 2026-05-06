import { createHttp } from './http';

const http = createHttp('http://localhost:5002');

export async function assignTicket(payload) {
  const res = await http.post('/assign', payload);
  return res.data;
}

export async function respondToTicket(payload) {
  const res = await http.post('/respond', payload);
  return res.data;
}

export async function resolveTicket(ticketId) {
  const res = await http.put(`/resolve/${ticketId}`);
  return res.data;
}

