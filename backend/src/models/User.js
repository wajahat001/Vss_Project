const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager', 'admin'], default: 'employee' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  department: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
