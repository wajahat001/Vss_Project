const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, companyId, department } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    const hashed = await bcrypt.hash(password, 10);
    const userData = { name, email, password: hashed, role, department };
    // only set companyId if it looks like a valid ObjectId (24 hex chars)
    if (companyId && /^[a-fA-F0-9]{24}$/.test(companyId)) {
      userData.companyId = companyId;
    }
    const user = new User(userData);
    await user.save();
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const payload = { sub: user._id, role: user.role, companyId: user.companyId, department: user.department };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, companyId: user.companyId, department: user.department } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/refresh', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

module.exports = router;
