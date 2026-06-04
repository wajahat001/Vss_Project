const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
  department: String,
  answers: [{ type: Object }],
  sentimentScore: Number
}, { timestamps: true });

module.exports = mongoose.model('Response', ResponseSchema);
