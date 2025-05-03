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
// Get a single survey by ID
router.get('/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    res.json(survey);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await Survey.findByIdAndDelete(req.params.id);
    await Response.deleteMany({ surveyId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete survey' });
  }
});

module.exports = router;
