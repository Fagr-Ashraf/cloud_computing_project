import { createHttp } from './http';

const http = createHttp('http://localhost:5002');

export async function getInteraction(ticketId) {
  const res = await http.get(`/support/${ticketId}`);
  return res.data;
}

export async function respond(ticketId, { message, status, priority }) {
  const res = await http.post('/respond', { ticketId, message, status, priority });
  return res.data;
}

export async function resolve(ticketId) {
  const res = await http.put(`/resolve/${ticketId}`);
  return res.data;
}

