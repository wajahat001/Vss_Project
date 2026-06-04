const express = require('express');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const { sendMail } = require('../services/emailService');

const router = express.Router();

// POST /api/notifications/remind
router.post('/remind', auth, async (req, res) => {
  try {
    const employees = await User.find({ companyId: req.user.companyId, role: 'employee' }).select('email name');
    if (employees.length === 0) {
      return res.json({ ok: true, sent: 0 });
    }

    const html = `
      <p>Hi,</p>
      <p>Your weekly pulse survey is ready. Please take a few minutes to share your feedback — it's completely anonymous.</p>
      <p>Thank you!</p>
    `;

    await Promise.all(
      employees.map(emp =>
        sendMail(emp.email, 'Your weekly pulse survey is ready', html)
      )
    );

    res.json({ ok: true, sent: employees.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
