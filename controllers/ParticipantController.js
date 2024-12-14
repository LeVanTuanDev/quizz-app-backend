const Participant = require("../models/ParticipantModel");
const QuizResult = require("../models/QuizResultModel");
const Question = require("../models/QuestionModel");
const Quiz = require("../models/QuizModel");

const participantControllers = {
  participateInQuiz: async (req, res) => {
    const { participantId, quizId, answers } = req.body;
    try {
      const participant = await Participant.findById(participantId);
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }

      const quiz = await Quiz.findByIdAndUpdate(
        quizId,
        { $inc: { participantCount: 1 } },
        { new: true }
      );
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      let correctCount = 0;
      const results = [];

      for (const answer of answers) {
        const question = await Question.findById(answer.question).populate(
          "answers correctAnswer"
        );

        if (!question) {
          return res
            .status(404)
            .json({ message: `Question ${answer.question} not found` });
        }

        const isCorrect =
          question.correctAnswer._id.toString() === answer.answer ||
          (answer.answers &&
            answer.answers.some(
              (a) => a.toString() === question.correctAnswer._id.toString()
            ));

        if (isCorrect) {
          correctCount++;
          if (!question.correctParticipants.includes(participantId)) {
            question.correctParticipants.push(participantId);
          }
        } else {
          if (!question.incorrectParticipants.includes(participantId)) {
            question.incorrectParticipants.push(participantId);
          }
        }

        results.push({
          question: question._id,
          answer: answer.answer,
          allAnswers: question.answers.map((ans) => ans._id), // Lưu tất cả đáp án
          isCorrect,
        });

        await question.save();
      }

      const totalQuestions = answers.length;
      const correctRate = (correctCount / totalQuestions) * 100;

      const quizResult = new QuizResult({
        participant: participantId,
        quiz: quizId,
        correctRate,
        incorrectRate: 100 - correctRate,
        answers: results,
      });
      await quizResult.save();

      await Participant.findByIdAndUpdate(participantId, {
        $push: { quizResults: quizResult._id },
      });

      const allResults = await QuizResult.find({ quiz: quizId });
      const totalParticipants = allResults.length;

      const totalCorrectRate = allResults.reduce(
        (sum, result) => sum + result.correctRate,
        0
      );
      const totalIncorrectRate = allResults.reduce(
        (sum, result) => sum + result.incorrectRate,
        0
      );

      const averageCorrectRate = totalCorrectRate / totalParticipants;
      const averageIncorrectRate = totalIncorrectRate / totalParticipants;

      quiz.correctRate = averageCorrectRate;
      quiz.incorrectRate = averageIncorrectRate;
      await quiz.save();

      res.status(201).json({
        message: "Quiz participation recorded successfully",
        quizResult,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // {
  //   "participantId": "6759a8a65431bda098f3afef",
  //   "quizId": "6759b0b51681f80c0e5f5782",
  //   "answers": [
  //     {
  //       "question": "6759b0b51681f80c0e5f5784",
  //       "answer": "6759b0b51681f80c0e5f5786"
  //     },
  //     {
  //       "question": "6759b0b51681f80c0e5f578b",
  //       "answer": "6759b0b51681f80c0e5f578f"
  //     }
  //   ]
  // }

  getQuizResult: async (req, res) => {
    const { participantId, quizId } = req.params;
    try {
      const quizResult = await QuizResult.findOne({
        participant: participantId,
        quiz: quizId,
      }).populate("answers.question answers.answer answers.allAnswers");

      if (!quizResult) {
        return res.status(404).json({ message: "Quiz result not found" });
      }

      res.status(200).json({ quizResult });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  createParticipant: async (req, res) => {
    const { name } = req.body;
    try {
      // Tạo người chơi mới
      const participant = new Participant({ name });
      await participant.save();
      res
        .status(201)
        .json({ message: "Participant created successfully", participant });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy tất cả người chơi
  getAllParticipants: async (req, res) => {
    try {
      const participants = await Participant.find();
      res.status(200).json({ participants });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy người chơi theo ID
  getParticipantById: async (req, res) => {
    const { id } = req.params;
    try {
      const participant = await Participant.findById(id).populate(
        "quizResults"
      );
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }
      res.status(200).json({ participant });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = participantControllers;
