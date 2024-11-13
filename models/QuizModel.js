const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // Tham chiếu đến các câu hỏi
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Người tạo quiz
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
