const express = require('express');
const auth = require('../middleware/authMiddleware');
const { generateReport } = require('../services/pdfService');
const Response = require('../models/Response');
const SentimentLog = require('../models/SentimentLog');

const router = express.Router();

router.post('/export', auth, async (req, res) => {
  try {
    const Survey = require('../models/Survey');
    const Company = require('../models/Company');

    const company = await Company.findById(req.user.companyId);
    const surveys = await Survey.find({ companyId: req.user.companyId }).select('_id title');
    const surveyIds = surveys.map(s => s._id);

    const departmentScores = await Response.aggregate([
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
    departmentScores.sort((a, b) => b.avgScore - a.avgScore);

    const responseCount = departmentScores.reduce((sum, d) => sum + d.count, 0);

    const trends = await SentimentLog.aggregate([
      { $match: { surveyId: { $in: surveyIds } } },
      { $group: { _id: '$weekNumber', avgScore: { $avg: '$avgScore' } } },
      { $project: { _id: 0, week: '$_id', avgScore: 1 } },
    ]);
    trends.sort((a, b) => a.week - b.week);

    const pdfBuffer = await generateReport({
      companyName: company?.name,
      surveyTitle: surveys.map(s => s.title).join(', '),
      responseCount,
      departmentScores,
      trends,
    });

    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'attachment; filename="pulse-report.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
