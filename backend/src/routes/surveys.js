const express = require('express');
const Survey = require('../models/Survey');
const Response = require('../models/Response');
const SentimentLog = require('../models/SentimentLog');
const auth = require('../middleware/authMiddleware');
const { analyzeSentiment } = require('../services/sentimentService');

function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

const router = express.Router();

// --- public routes (no auth) — MUST be before /:id ---

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

// POST anonymous response via share token
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

    // update SentimentLog for trend chart
    const dept = department || 'External';
    const weekNumber = getWeekNumber(new Date());
    const existing = await SentimentLog.findOne({ surveyId: survey._id, department: dept, weekNumber });
    if (existing) {
      const weekResponses = await Response.find({ surveyId: survey._id, department: dept });
      const avg = weekResponses.reduce((s, r) => s + (r.sentimentScore || 0.5), 0) / weekResponses.length;
      existing.avgScore = avg;
      await existing.save();
    } else {
      await new SentimentLog({ surveyId: survey._id, department: dept, avgScore: resp.sentimentScore || 0.5, weekNumber }).save();
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- authenticated routes ---

router.post('/create', auth, async (req, res) => {
  try {
    const { title, questions, frequency } = req.body;
    if (!title || !questions) return res.status(400).json({ error: 'title and questions are required' });
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

module.exports = router;
