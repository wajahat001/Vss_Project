const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const surveysRoutes = require('./routes/surveys');
const responsesRoutes = require('./routes/responses');
const sentimentRoutes = require('./routes/sentiment');
const reportsRoutes = require('./routes/reports');
const notificationsRoutes = require('./routes/notifications');
const companiesRoutes = require('./routes/companies');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveysRoutes);
app.use('/api/responses', responsesRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/companies', companiesRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

module.exports = app;
