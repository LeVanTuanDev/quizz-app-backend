const questionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  questionText: { type: String, required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }], // Tham chiếu đến các câu trả lời
  correctAnswer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" }, // Đáp án đúng
});

module.exports = mongoose.model("Question", questionSchema);
