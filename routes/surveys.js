const express = require('express');
const Survey = require('../models/Survey');
const router = express.Router();

router.post('/', async (req, res) => {
  const { title, questions } = req.body;
  const survey = new Survey({ title, questions });
  await survey.save();
  res.json(survey);
});

router.get('/', async (req, res) => {
  const surveys = await Survey.find();
  res.json(surveys);
});

module.exports = router;
