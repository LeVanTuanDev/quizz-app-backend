const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  answerText: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});

const Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;
