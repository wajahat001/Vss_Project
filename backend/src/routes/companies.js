const express = require('express');
const Company = require('../models/Company');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/companies/:id
router.get('/:id', auth, async (req, res) => {
  try {
    // only allow access to own company
    if (req.user.companyId?.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/companies/:id
router.patch('/:id', auth, async (req, res) => {
  try {
    if (req.user.companyId?.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // only admins and managers can update company profile
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient role' });
    }
    const { name, domain, departments } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (domain !== undefined) update.domain = domain;
    if (Array.isArray(departments)) update.departments = departments;

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
