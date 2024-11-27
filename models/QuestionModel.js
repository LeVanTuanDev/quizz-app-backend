const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  questionText: { type: String, required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  correctAnswer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
  correctRate: { type: Number, default: 0 },
  incorrectRate: { type: Number, default: 0 },
  correctParticipants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
  ],
  incorrectParticipants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
  ],
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
