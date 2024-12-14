const QuizResult = require("../models/QuizResultModel");

const quizResultController = {
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
      const correctCount = quizResult.answers.filter(
        (a) =>
          a.isCorrect ||
          (a.answers &&
            a.answers.some(
              (ans) => ans.toString() === a.question.correctAnswer.toString()
            ))
      ).length;

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
  getQuizResultByQuizId: async (req, res) => {
    const { quizId } = req.params;
    try {
      const quizResults = await QuizResult.find({ quiz: quizId }).populate(
        "participant answers.answers"
      );
      res.status(200).json(quizResults);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = quizResultController;
