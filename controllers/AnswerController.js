const Answer = require("../models/AnswerModel.js");

const answerControllers = {
  createAnswer: async (req, res) => {
    const { question, answerText, isCorrect } = req.body;
    try {
      const newAnswer = await Answer.create({
        question,
        answerText,
        isCorrect,
      });
      res.status(201).json(newAnswer);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo đáp án.", error });
    }
  },

  getAllAnswers: async (req, res) => {
    try {
      const answers = await Answer.find().populate("question");
      res.status(200).json(answers);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách đáp án.", error });
    }
  },

  getAnswerById: async (req, res) => {
    const { id } = req.params;
    try {
      const answer = await Answer.findById(id).populate("question");
      if (!answer)
        return res.status(404).json({ message: "Đáp án không tồn tại." });
      res.status(200).json(answer);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy đáp án.", error });
    }
  },

  updateAnswer: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedAnswer = await Answer.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedAnswer)
        return res.status(404).json({ message: "Đáp án không tồn tại." });
      res.status(200).json(updatedAnswer);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật đáp án.", error });
    }
  },

  deleteAnswer: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedAnswer = await Answer.findByIdAndDelete(id);
      if (!deletedAnswer)
        return res.status(404).json({ message: "Đáp án không tồn tại." });
      res.status(200).json({ message: "Xóa đáp án thành công." });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa đáp án.", error });
    }
  },
};

module.exports = answerControllers;
