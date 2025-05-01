const express = require('express');
const Response = require('../models/Response');
const router = express.Router();

router.post('/', async (req, res) => {
  const { surveyId, answers } = req.body;
  const response = new Response({ surveyId, answers });
  await response.save();
  res.json(response);
});

router.get('/csat/:surveyId', async (req, res) => {
  const { surveyId } = req.params;
  const responses = await Response.find({ surveyId });

  if (responses.length === 0) {
    return res.json({
      totalSubmissions: 0,
      averageCSAT: null,
      perQuestionAverage: []
    });
  }

  const totalSubmissions = responses.length;
  const numQuestions = responses[0].answers.length;

  const perQuestionTotal = Array(numQuestions).fill(0);
  const perQuestionAverage = Array(numQuestions).fill(0);

  let totalScore = 0;
  let scoreCount = 0;

  responses.forEach((resp) => {
    resp.answers.forEach((score, index) => {
      perQuestionTotal[index] += score;
      totalScore += score;
      scoreCount++;
    });
  });

  for (let i = 0; i < numQuestions; i++) {
    perQuestionAverage[i] = (perQuestionTotal[i] / totalSubmissions).toFixed(2);
  }

  const averageCSAT = (totalScore / scoreCount).toFixed(2);

  res.json({
    totalSubmissions,
    averageCSAT,
    perQuestionAverage
  });
});


module.exports = router;
