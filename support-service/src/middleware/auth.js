const jwt = require('jsonwebtoken');

function authRequired(jwtSecret) {
  return async function auth(req, res, next) {
    try {
      const header = req.headers.authorization || '';
      const [type, token] = header.split(' ');
      if (type !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
      }
      const payload = jwt.verify(token, jwtSecret);
      req.user = payload;
      console.log(req.user);
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

function requireRole(...roles) {
  const allowed = new Set(roles);
  return async function roleGuard(req, res, next) {
    const role = req.user?.role;
    if (!role || !allowed.has(role)) return res.status(403).json({ error: 'Forbidden' });
    return next();
  };
}

module.exports = { authRequired, requireRole };

