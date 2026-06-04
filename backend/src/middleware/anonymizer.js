// anonymizer: remove user-identifying fields from request before saving
function anonymizer(req, res, next) {
  if (req.body) {
    delete req.body.userId;
    delete req.body.email;
    delete req.body.name;
    delete req.body.employeeId;
  }
  next();
}

module.exports = anonymizer;
