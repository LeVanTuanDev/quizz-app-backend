const Quiz = require("../models/QuizModel.js");

const quizControllers = {
  createQuiz: async (req, res) => {
    const { title, questions, createdBy } = req.body;
    try {
      const newQuiz = await Quiz.create({ title, questions, createdBy });
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
    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedQuiz)
        return res.status(404).json({ message: "Quiz không tồn tại." });
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
