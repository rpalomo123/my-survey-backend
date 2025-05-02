const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
  answers: [Number],
  comments: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', responseSchema);
