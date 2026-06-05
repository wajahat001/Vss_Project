const express = require('express');
const Response = require('../models/Response');
const Survey = require('../models/Survey');
const SentimentLog = require('../models/SentimentLog');
const auth = require('../middleware/authMiddleware');
const anonymizer = require('../middleware/anonymizer');
const { analyzeSentiment } = require('../services/sentimentService');

const router = express.Router();

function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

router.post('/submit', auth, anonymizer, async (req, res) => {
  try {
    const { surveyId, department, answers } = req.body;
    if (!surveyId || !department || !answers) {
      return res.status(400).json({ error: 'surveyId, department, and answers are required' });
    }
    const resp = new Response({ surveyId, department, answers });
    const allText = answers.map(a => a.answer).join(' ');
    if (allText.trim()) {
      resp.sentimentScore = await analyzeSentiment(allText);
    }
    await resp.save();

    // update SentimentLog for trend chart
    const weekNumber = getWeekNumber(new Date());
    const existing = await SentimentLog.findOne({ surveyId, department, weekNumber });
    if (existing) {
      // recalculate avg from all responses this week for this dept
      const weekResponses = await Response.find({ surveyId, department });
      const avg = weekResponses.reduce((s, r) => s + (r.sentimentScore || 0.5), 0) / weekResponses.length;
      existing.avgScore = avg;
      await existing.save();
    } else {
      await new SentimentLog({ surveyId, department, avgScore: resp.sentimentScore || 0.5, weekNumber }).save();
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// public submit (via share token) — also logs sentiment
router.post('/public-submit', async (req, res) => {
  try {
    const { surveyId, department, answers, sentimentScore } = req.body;
    const weekNumber = getWeekNumber(new Date());
    const existing = await SentimentLog.findOne({ surveyId, department, weekNumber });
    if (existing) {
      const weekResponses = await Response.find({ surveyId, department });
      const avg = weekResponses.reduce((s, r) => s + (r.sentimentScore || 0.5), 0) / weekResponses.length;
      existing.avgScore = avg;
      await existing.save();
    } else {
      await new SentimentLog({ surveyId, department, avgScore: sentimentScore || 0.5, weekNumber }).save();
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const surveys = await Survey.find({ companyId: req.user.companyId }).select('_id');
    const surveyIds = surveys.map(s => s._id);
    const responses = await Response.find({ surveyId: { $in: surveyIds } });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
