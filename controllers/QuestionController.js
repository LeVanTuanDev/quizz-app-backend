const Question = require("../models/QuestionModel.js");

const questionControllers = {
  createQuestion: async (req, res) => {
    const { quiz, questionText, answers, correctAnswer } = req.body;
    try {
      const question = await Question.create({
        quiz,
        questionText,
        answers,
        correctAnswer,
      });
      res.status(201).json(question);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllQuestions: async (req, res) => {
    try {
      const questions = await Question.find().populate(
        "quiz answers correctAnswer"
      );
      res.status(200).json(questions);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách câu hỏi.", error });
    }
  },

  getQuestionById: async (req, res) => {
    const { id } = req.params;
    try {
      const question = await Question.findById(id).populate(
        "quiz answers correctAnswer"
      );
      if (!question)
        return res.status(404).json({ message: "Question không tồn tại." });
      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy câu hỏi.", error });
    }
  },

  updateQuestion: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedQuestion)
        return res.status(404).json({ message: "Câu hỏi không tồn tại." });
      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật câu hỏi.", error });
    }
  },

  deleteQuestion: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedQuestion = await Question.findByIdAndDelete(id);
      if (!deletedQuestion)
        return res.status(404).json({ message: "Câu hỏi không tồn tại." });
      res.status(200).json({ message: "Xóa câu hỏi thành công." });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa câu hỏi.", error });
    }
  },
};

module.exports = questionControllers;
