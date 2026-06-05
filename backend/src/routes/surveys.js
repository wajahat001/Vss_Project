const express = require('express');
const Survey = require('../models/Survey');
const Response = require('../models/Response');
const auth = require('../middleware/authMiddleware');
const { analyzeSentiment } = require('../services/sentimentService');

const router = express.Router();

// --- authenticated routes ---

router.post('/create', auth, async (req, res) => {
  try {
    const { title, questions, frequency } = req.body;
    if (!title || !questions) return res.status(400).json({ error: 'title and questions are required' });
    // deactivate any existing active survey for this company
    await Survey.updateMany({ companyId: req.user.companyId, isActive: true }, { isActive: false });
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

// --- public routes (no auth) ---

// GET survey by share token
router.get('/public/:token', async (req, res) => {
  try {
    const survey = await Survey.findOne({ shareToken: req.params.token, isActive: true });
    if (!survey) return res.status(404).json({ error: 'Survey not found or inactive' });
    res.json(survey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST anonymous response via share token (no auth middleware, no anonymizer needed)
router.post('/public/:token/respond', async (req, res) => {
  try {
    const survey = await Survey.findOne({ shareToken: req.params.token, isActive: true });
    if (!survey) return res.status(404).json({ error: 'Survey not found or inactive' });

    const { department, answers } = req.body;
    if (!answers || !Array.isArray(answers)) return res.status(400).json({ error: 'answers required' });

    const resp = new Response({
      surveyId: survey._id,
      department: department || 'External',
      answers,
    });

    const allText = answers.map(a => a.answer).join(' ');
    if (allText.trim()) {
      resp.sentimentScore = await analyzeSentiment(allText);
    }
    await resp.save();
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
