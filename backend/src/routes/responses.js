const express = require('express');
const Response = require('../models/Response');
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
    // run sentiment analysis on all answer text
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
    const responses = await Response.find({ department: req.user.department });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
