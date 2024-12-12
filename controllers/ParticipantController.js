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
        if (isCorrect) {
          correctCount++;
          // Thêm người chơi vào correctParticipants
          if (!question.correctParticipants.includes(participantId)) {
            question.correctParticipants.push(participantId);
          }
        } else {
          // Thêm người chơi vào incorrectParticipants
          if (!question.incorrectParticipants.includes(participantId)) {
            question.incorrectParticipants.push(participantId);
          }
        }

        results.push({
          question: answer.question,
          answer: answer.answer,
          isCorrect,
        });

        // Lưu cập nhật cho câu hỏi
        await question.save();
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
      }).populate("answers.question answers.answer");

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
