const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role, companyId, department } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role, companyId, department });
  await user.save();
  res.status(201).json({ ok: true });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid' });
  const payload = { sub: user._id, role: user.role, companyId: user.companyId, department: user.department };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, companyId: user.companyId, department: user.department } });
});

router.post('/refresh', (req, res) => {
  // simple refresh stub: in prod use refresh tokens
  res.status(501).json({ error: 'Not implemented' });
});

module.exports = router;
