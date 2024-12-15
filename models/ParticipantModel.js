const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quizResults: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuizResult" }],
});

const Participant = mongoose.model("Participant", participantSchema);
module.exports = Participant;
