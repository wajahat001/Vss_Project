const express = require('express');
const Response = require('../models/Response');
const auth = require('../middleware/authMiddleware');
const anonymizer = require('../middleware/anonymizer');

const router = express.Router();

router.post('/submit', anonymizer, async (req, res) => {
  const resp = new Response({ ...req.body });
  await resp.save();
  res.status(201).json({ ok: true });
});

router.get('/my', auth, async (req, res) => {
  // returns responses by department/company — no userId
  const responses = await Response.find({ department: req.user.department });
  res.json(responses);
});

module.exports = router;
