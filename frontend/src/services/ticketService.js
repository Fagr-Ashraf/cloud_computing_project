import { createHttp } from './http';

const http = createHttp('http://localhost:5001');

export async function listTickets() {
  const res = await http.get('/tickets');
  return res.data;
}

export async function createTicket(payload) {
  const res = await http.post('/tickets', payload);
  return res.data;
}

export async function getTicket(id) {
  const res = await http.get(`/tickets/${id}`);
  return res.data;
}

export async function updateTicket(id, payload) {
  const res = await http.put(`/tickets/${id}`, payload);
  return res.data;
}

