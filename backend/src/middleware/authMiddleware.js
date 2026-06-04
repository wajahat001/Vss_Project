const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    // cast companyId to ObjectId so mongoose aggregation $match works correctly
    if (payload.companyId) {
      payload.companyId = new mongoose.Types.ObjectId(payload.companyId);
    }
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
