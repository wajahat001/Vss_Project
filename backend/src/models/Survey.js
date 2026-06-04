const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  title: String,
  questions: [{ type: Object }],
  isActive: { type: Boolean, default: false },
  frequency: String
}, { timestamps: true });

module.exports = mongoose.model('Survey', SurveySchema);
