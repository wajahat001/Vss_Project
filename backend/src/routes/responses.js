const express = require('express');
const Response = require('../models/Response');
const Survey = require('../models/Survey');
const auth = require('../middleware/authMiddleware');
const anonymizer = require('../middleware/anonymizer');
const { analyzeSentiment } = require('../services/sentimentService');

const router = express.Router();

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
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    // only return responses for surveys belonging to this user's company
    const surveys = await Survey.find({ companyId: req.user.companyId }).select('_id');
    const surveyIds = surveys.map(s => s._id);
    const responses = await Response.find({ surveyId: { $in: surveyIds } }).sort({ _id: -1 });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
