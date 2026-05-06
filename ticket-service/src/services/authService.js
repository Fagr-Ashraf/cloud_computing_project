const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register({ username, password, role }) {
  const normalized = String(username || '').trim().toLowerCase();
  if (!normalized) {
    const e = new Error('username is required');
    e.statusCode = 400;
    throw e;
  }
  if (!password || String(password).length < 6) {
    const e = new Error('password must be at least 6 characters');
    e.statusCode = 400;
    throw e;
  }

  const existing = await User.findOne({ username: normalized }).lean();
  if (existing) {
    const e = new Error('username already exists');
    e.statusCode = 409;
    throw e;
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await User.create({
    username: normalized,
    passwordHash,
    role: role === 'ADMIN' ? 'ADMIN' : 'USER'
  });

  return { _id: user._id, username: user.username, role: user.role };
}

async function login({ username, password, jwtSecret, jwtExpiresIn }) {
  const normalized = String(username || '').trim().toLowerCase();
  if (!normalized || !password) {
    const e = new Error('username and password are required');
    e.statusCode = 400;
    throw e;
  }

  const user = await User.findOne({ username: normalized });
  if (!user) {
    const e = new Error('invalid credentials');
    e.statusCode = 401;
    throw e;
  }

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) {
    const e = new Error('invalid credentials');
    e.statusCode = 401;
    throw e;
  }

  const token = jwt.sign(
    { userId: String(user._id), role: user.role, username: user.username },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  return {
    token,
    user: { userId: String(user._id), role: user.role, username: user.username }
  };
}

module.exports = { register, login };

