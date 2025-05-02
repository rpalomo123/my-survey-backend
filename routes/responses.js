const express = require('express');
const router = express.Router();
const Response = require('../models/Response');

router.post('/', async (req, res) => {
  const { surveyId, answers, comments } = req.body;
  console.log("Incoming response:", req.body);
  try {
    const response = new Response({ surveyId, answers, comments });
    await response.save();
    res.json(response);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: 'Failed to save response' });
  }
});

router.get('/raw/:surveyId', async (req, res) => {
  try {
    const responses = await Response.find({ surveyId: req.params.surveyId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch raw responses' });
  }
});

router.get('/csat/:surveyId', async (req, res) => {
  try {
    const responses = await Response.find({ surveyId: req.params.surveyId });
    const total = responses.length;
    if (!total) return res.json({ averageCSAT: 0, totalSubmissions: 0, perQuestionAverage: [] });

    const numQuestions = responses[0].answers.length;
    const perQuestionSum = Array(numQuestions).fill(0);

    responses.forEach(r => {
      r.answers.forEach((score, i) => {
        perQuestionSum[i] += score;
      });
    });

    const perQuestionAverage = perQuestionSum.map(sum => (sum / total).toFixed(2));
    const totalScore = responses.reduce((acc, r) => acc + r.answers.reduce((a, b) => a + b, 0), 0);
    const count = total * numQuestions;
    const averageCSAT = (totalScore / count).toFixed(2);

    res.json({ averageCSAT, totalSubmissions: total, perQuestionAverage });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate CSAT' });
  }
});

module.exports = router;
