// anonymizer: remove user-identifying fields from request before saving
function anonymizer(req, res, next) {
  if (req.body) {
    // ensure no userId is saved with responses
    if (req.body.userId) delete req.body.userId;
  }
  next();
}

module.exports = anonymizer;
