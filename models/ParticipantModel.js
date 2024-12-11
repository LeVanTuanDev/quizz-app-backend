const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quizResults: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuizResult" }], // Tham chiếu đến đến quả ở các Quiz
});

const Participant = mongoose.model("Participant", participantSchema);
module.exports = Participant;
