import { createHttp } from './http';

const http = createHttp('http://localhost:5004');

export async function getReport() {
  const res = await http.get('/report');
  return res.data;
}

