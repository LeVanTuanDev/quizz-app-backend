const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  participantCount: { type: Number, default: 0 },
  questionCount: { type: Number, default: 0 },
  // correctRate: { type: Number, default: 0 },
  // incorrectRate: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
