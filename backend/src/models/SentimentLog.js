const mongoose = require('mongoose');

const SentimentLogSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
  department: String,
  avgScore: Number,
  weekNumber: Number
}, { timestamps: true });

module.exports = mongoose.model('SentimentLog', SentimentLogSchema);
