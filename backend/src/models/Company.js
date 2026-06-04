const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: String,
  domain: String,
  plan: String,
  departments: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);
