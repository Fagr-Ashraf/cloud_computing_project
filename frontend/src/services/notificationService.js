import { createHttp } from './http';

const http = createHttp('http://localhost:5003');

export async function notify(payload) {
  const res = await http.post('/notify', payload);
  return res.data;
}

