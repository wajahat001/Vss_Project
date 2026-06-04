const express = require('express');
const Survey = require('../models/Survey');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', auth, async (req, res) => {
  // manager creates survey
  const s = new Survey({ ...req.body });
  await s.save();
  res.status(201).json(s);
});

router.get('/active', auth, async (req, res) => {
  const active = await Survey.findOne({ companyId: req.user.companyId, isActive: true });
  res.json(active || null);
});

router.get('/:id', auth, async (req, res) => {
  const s = await Survey.findById(req.params.id);
  res.json(s);
});

module.exports = router;
