const express = require('express');
const Survey = require('../models/Survey');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', auth, async (req, res) => {
  try {
    const { title, questions, frequency } = req.body;
    if (!title || !questions) return res.status(400).json({ error: 'title and questions are required' });
    const survey = new Survey({ companyId: req.user.companyId, title, questions, frequency, isActive: true });
    await survey.save();
    res.status(201).json(survey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/active', auth, async (req, res) => {
  try {
    const active = await Survey.findOne({ companyId: req.user.companyId, isActive: true });
    res.json(active || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ error: 'Survey not found' });
    res.json(survey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
