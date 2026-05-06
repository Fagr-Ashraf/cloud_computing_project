export function getToken() {
  return localStorage.getItem('jwt') || '';
}

export function setToken(token) {
  if (!token) localStorage.removeItem('jwt');
  else localStorage.setItem('jwt', token);
}

export function decodeJwt(token) {
  try {
    const parts = String(token).split('.');
    if (parts.length !== 3) return null;
    const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export function getAuthUser() {
  const token = getToken();
  if (!token) return null;
  const payload = decodeJwt(token);
  if (!payload?.userId || !payload?.role || !payload?.username) return null;
  return { token, userId: payload.userId, role: payload.role, username: payload.username };
}

