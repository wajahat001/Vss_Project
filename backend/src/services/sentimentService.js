const axios = require('axios');

async function analyzeSentiment(text) {
  const endpoint = process.env.AZURE_LANGUAGE_ENDPOINT;
  const key = process.env.AZURE_LANGUAGE_KEY;

  if (!endpoint || !key) {
    // fallback neutral score when Azure is not configured
    return 0.5;
  }

  const url = `${endpoint}/text/analytics/v3.1/sentiment`;
  const body = {
    documents: [{ id: '1', language: 'en', text }],
  };

  const response = await axios.post(url, body, {
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/json',
    },
  });

  const doc = response.data.documents[0];
  return doc.confidenceScores.positive;
}

module.exports = { analyzeSentiment };
