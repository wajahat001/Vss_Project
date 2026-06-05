const express = require('express');
const auth = require('../middleware/authMiddleware');
const Survey = require('../models/Survey');
const { sendMail } = require('../services/emailService');

const router = express.Router();

// POST /api/notifications/remind — send survey invite link to a specific email
router.post('/remind', auth, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });

    // get active survey share link
    const survey = await Survey.findOne({ companyId: req.user.companyId, isActive: true });
    const frontendUrl = process.env.FRONTEND_URL || 'https://vss-project.vercel.app';
    const surveyLink = survey?.shareToken
      ? `${frontendUrl}/s/${survey.shareToken}`
      : frontendUrl;

    const html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#0F1117;color:#F0F0F5;border-radius:14px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-flex;align-items:center;gap:10px;">
            <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(120deg,#6C63FF,#00D9A3);display:inline-flex;align-items:center;justify-content:center;">
              🔒
            </div>
            <span style="font-size:20px;font-weight:700;color:#F0F0F5;">PulseCheck</span>
          </div>
        </div>
        <h2 style="color:#F0F0F5;font-size:22px;margin-bottom:8px;">You've been invited!</h2>
        <p style="color:#8B8FA8;line-height:1.6;">
          Your team wants your honest feedback. Fill out this quick anonymous survey — your identity is <strong style="color:#00D9A3;">never stored</strong>.
        </p>
        <div style="text-align:center;margin:28px 0;">
          <a href="${surveyLink}"
            style="display:inline-block;padding:14px 32px;background:linear-gradient(120deg,#6C63FF,#00D9A3);color:#0b0c12;font-weight:700;font-size:15px;border-radius:8px;text-decoration:none;">
            Fill Survey Anonymously →
          </a>
        </div>
        <p style="color:#5D6178;font-size:12px;text-align:center;">
          No account needed. No personal data collected. 100% anonymous.
        </p>
      </div>
    `;

    await sendMail(email, '📋 You\'ve been invited to fill a pulse survey', html);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
