const express = require('express');
const Response = require('../models/Response');
const SentimentLog = require('../models/SentimentLog');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', auth, async (req, res) => {
  try {
    const Survey = require('../models/Survey');
    const surveys = await Survey.find({ companyId: req.user.companyId }).select('_id');
    const surveyIds = surveys.map(s => s._id);

    const results = await Response.aggregate([
      { $match: { surveyId: { $in: surveyIds } } },
      {
        $group: {
          _id: '$department',
          avgScore: { $avg: '$sentimentScore' },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, department: '$_id', avgScore: 1, count: 1 } },
    ]);

    // sort in JS to avoid Cosmos DB index requirement
    results.sort((a, b) => b.avgScore - a.avgScore);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/trends', auth, async (req, res) => {
  try {
    const Survey = require('../models/Survey');
    const surveys = await Survey.find({ companyId: req.user.companyId }).select('_id');
    const surveyIds = surveys.map(s => s._id);

    const results = await SentimentLog.aggregate([
      { $match: { surveyId: { $in: surveyIds } } },
      {
        $group: {
          _id: '$weekNumber',
          avgScore: { $avg: '$avgScore' },
        },
      },
      { $project: { _id: 0, week: '$_id', avgScore: 1 } },
    ]);

    // sort in JS to avoid Cosmos DB index requirement
    results.sort((a, b) => a.week - b.week);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
