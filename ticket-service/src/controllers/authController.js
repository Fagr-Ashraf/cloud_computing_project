const authService = require('../services/authService');
const env = require('../config/env');

async function register(req, res) {
  const { username, password, role } = req.body || {};
  const user = await authService.register({ username, password, role });
  return res.status(201).json(user);
}

async function login(req, res) {
  const { username, password } = req.body || {};
  const result = await authService.login({
    username,
    password,
    jwtSecret: env.jwtSecret,
    jwtExpiresIn: env.jwtExpiresIn
  });
  return res.json(result);
}

module.exports = { register, login };

