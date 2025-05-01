const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  title: String,
  questions: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Survey', surveySchema);
