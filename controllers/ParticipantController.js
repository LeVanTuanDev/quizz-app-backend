const Participant = require("../models/ParticipantModel");
const QuizResult = require("../models/QuizResultModel");
const Question = require("../models/QuestionModel");

const participantControllers = {
  participateInQuiz: async (req, res) => {
    const { participantId, quizId, answers } = req.body;
    try {
      // Xác minh người tham gia
      const participant = await Participant.findById(participantId);
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }

      // Xử lý kết quả quiz
      let correctCount = 0;
      const results = [];

      for (const answer of answers) {
        const question = await Question.findById(answer.question).populate(
          "correctAnswer"
        );

        if (!question) {
          return res
            .status(404)
            .json({ message: `Question ${answer.question} not found` });
        }

        const isCorrect =
          question.correctAnswer._id.toString() === answer.answer;
        if (isCorrect) correctCount++;

        results.push({
          question: answer.question,
          answer: answer.answer,
          isCorrect,
        });
      }

      // Lưu kết quả quiz
      const quizResult = new QuizResult({
        participant: participantId,
        quiz: quizId,
        answers: results,
      });
      await quizResult.save();

      // Thêm quizResult vào participant
      await Participant.findByIdAndUpdate(participantId, {
        $push: { quizResults: quizResult._id },
      });

      // Tính toán số liệu
      const totalQuestions = answers.length;
      const correctRate = (correctCount / totalQuestions) * 100;

      res.status(201).json({
        message: "Quiz participation recorded successfully",
        quizResult,
        correctRate,
        incorrectRate: 100 - correctRate,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getQuizResult: async (req, res) => {
    const { participantId, quizId } = req.params;
    try {
      const quizResult = await QuizResult.findOne({
        participant: participantId,
        quiz: quizId,
      }).populate("answers.question answers.answer");

      if (!quizResult) {
        return res.status(404).json({ message: "Quiz result not found" });
      }

      res.status(200).json({ quizResult });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = participantControllers;
