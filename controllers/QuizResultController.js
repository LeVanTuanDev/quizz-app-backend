const QuizResult = require("../models/QuizResultModel.js");

const quizResultController = {
  createQuizResult: async (req, res) => {
    const { participant, quiz, score, answers } = req.body;
    try {
      const newQuizResult = await QuizResult.create({
        participant,
        quiz,
        score,
        answers,
      });
      res.status(201).json(newQuizResult);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo QuizResult.", error });
    }
  },

  getAllQuizResults: async (req, res) => {
    try {
      const quizResults = await QuizResult.find().populate(
        "participant quiz answers.question answers.answer"
      );
      res.status(200).json(quizResults);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách QuizResult.", error });
    }
  },

  getQuizResultById: async (req, res) => {
    const { id } = req.params;
    try {
      const quizResult = await QuizResult.findById(id).populate(
        "participant quiz answers.question answers.answer"
      );
      if (!quizResult)
        return res.status(404).json({ message: "QuizResult không tồn tại." });
      res.status(200).json(quizResult);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy QuizResult.", error });
    }
  },

  updateQuizResult: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedQuizResult = await QuizResult.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      if (!updatedQuizResult)
        return res.status(404).json({ message: "QuizResult không tồn tại." });
      res.status(200).json(updatedQuizResult);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật QuizResult.", error });
    }
  },

  deleteQuizResult: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedQuizResult = await QuizResult.findByIdAndDelete(id);
      if (!deletedQuizResult)
        return res.status(404).json({ message: "QuizResult không tồn tại." });
      res.status(200).json({ message: "Xóa QuizResult thành công." });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa QuizResult.", error });
    }
  },
};

module.exports = quizResultController;
