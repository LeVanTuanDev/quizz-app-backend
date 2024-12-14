const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  participant: { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  correctRate: { type: Number, default: 0 },
  incorrectRate: { type: Number, default: 0 },
  answers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      answer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" }, // Đáp án của người tham gia
      allAnswers: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Answer" }, // Tất cả đáp án của câu hỏi
      ],
      isCorrect: { type: Boolean },
    },
  ],
});

const QuizResult = mongoose.model("QuizResult", quizResultSchema);
module.exports = QuizResult;
