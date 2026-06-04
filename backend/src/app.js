const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const surveysRoutes = require('./routes/surveys');
const responsesRoutes = require('./routes/responses');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveysRoutes);
app.use('/api/responses', responsesRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

module.exports = app;
