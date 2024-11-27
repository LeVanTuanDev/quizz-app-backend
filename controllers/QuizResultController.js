const QuizResult = require("../models/QuizResultModel");
const Participant = require("../models/ParticipantModel");

const quizResultController = {
  saveQuizResult: async (req, res) => {
    const { participantId, quizId, answers } = req.body;
    try {
      // Kiểm tra nếu participant tồn tại
      const participant = await Participant.findById(participantId);
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }

      // Lưu kết quả quiz
      const quizResult = new QuizResult({
        participant: participantId,
        quiz: quizId,
        answers,
      });
      await quizResult.save();

      // Cập nhật quizResults của participant
      await Participant.findByIdAndUpdate(participantId, {
        $push: { quizResults: quizResult._id },
      });

      res
        .status(201)
        .json({ message: "Quiz result saved successfully", quizResult });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  calculateRate: async (req, res) => {
    const { quizResultId } = req.params;
    try {
      // Lấy kết quả quiz
      const quizResult = await QuizResult.findById(quizResultId).populate(
        "answers.question answers.answer"
      );

      if (!quizResult) {
        return res.status(404).json({ message: "Quiz result not found" });
      }

      const totalQuestions = quizResult.answers.length;
      const correctCount = quizResult.answers.filter((a) => a.isCorrect).length;

      // Tính tỷ lệ
      const correctRate = (correctCount / totalQuestions) * 100;
      const incorrectRate = 100 - correctRate;

      res.status(200).json({
        message: "Rate calculated successfully",
        correctRate,
        incorrectRate,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = quizResultController;
