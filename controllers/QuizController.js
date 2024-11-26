const Quiz = require("../models/QuizModel.js");

const quizControllers = {
  createQuiz: async (req, res) => {
    const { title, questions, createdBy } = req.body;
    try {
      const newQuiz = await Quiz.create({
        title,
        questions,
        createdBy,
        questionCount: questions.length, // Tự động tính số lượng câu hỏi
        participantCount: 0, // Ban đầu không có người tham gia
        correctRate: 0, // Tỉ lệ đúng khởi tạo
        incorrectRate: 0, // Tỉ lệ sai khởi tạo
      });
      res.status(201).json(newQuiz);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo Quiz.", error });
    }
  },

  getAllQuizzes: async (req, res) => {
    try {
      const quizzes = await Quiz.find().populate("questions createdBy");
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách Quiz.", error });
    }
  },

  getQuizById: async (req, res) => {
    const { id } = req.params;
    try {
      const quiz = await Quiz.findById(id).populate("questions createdBy");
      if (!quiz)
        return res.status(404).json({ message: "Quiz không tồn tại." });
      res.status(200).json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy Quiz.", error });
    }
  },

  updateQuiz: async (req, res) => {
    const { id } = req.params;
    const { questions } = req.body;

    try {
      const quiz = await Quiz.findById(id);
      if (!quiz)
        return res.status(404).json({ message: "Quiz không tồn tại." });

      if (questions) {
        quiz.questions = questions;
        quiz.questionCount = questions.length;
      }

      Object.assign(quiz, req.body);

      const updatedQuiz = await quiz.save();
      res.status(200).json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật Quiz.", error });
    }
  },

  deleteQuiz: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedQuiz = await Quiz.findByIdAndDelete(id);
      if (!deletedQuiz)
        return res.status(404).json({ message: "Quiz không tồn tại." });
      res.status(200).json({ message: "Xóa Quiz thành công." });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa Quiz.", error });
    }
  },
};

module.exports = quizControllers;
