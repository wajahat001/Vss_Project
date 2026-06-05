const mongoose = require('mongoose');
const crypto = require('crypto');

const SurveySchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  title: String,
  questions: [{ type: Object }],
  isActive: { type: Boolean, default: false },
  frequency: String,
  shareToken: { type: String, unique: true, sparse: true },
}, { timestamps: true });

SurveySchema.pre('save', function (next) {
  if (!this.shareToken) {
    this.shareToken = crypto.randomBytes(16).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Survey', SurveySchema);
