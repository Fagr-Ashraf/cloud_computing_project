import axios from 'axios';

// Auth lives in ticket-service for now.
const baseURL = 'http://localhost:5001';

export async function register(payload) {
  const res = await axios.post(`${baseURL}/auth/register`, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
  });
  return res.data;
}

export async function login(payload) {
  const res = await axios.post(`${baseURL}/auth/login`, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
  });
  return res.data;
}

