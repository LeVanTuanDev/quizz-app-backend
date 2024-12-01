const Answer = require("../models/AnswerModel.js");
const Question = require("../models/QuestionModel.js");

const answerControllers = {
  createAnswer: async (req, res) => {
    const { id, answerText, isCorrect } = req.body;

    try {
      const answer = new Answer({
        question: id,
        answerText,
        isCorrect,
      });
      await answer.save();

      await Question.findByIdAndUpdate(id, {
        $push: { answers: answer._id },
      });

      res.status(201).json({ message: "Answer added successfully", answer });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllAnswers: async (req, res) => {
    try {
      const answers = await Answer.find().populate("question");
      res.status(200).json(answers);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error when getting a list of answers.", error });
    }
  },

  getAnswerById: async (req, res) => {
    const { id } = req.params;
    try {
      const answer = await Answer.findById(id).populate("question");
      if (!answer) return res.status(404).json({ message: "Answer not found" });
      res.status(200).json(answer);
    } catch (error) {
      res.status(500).json({ message: "Error when getting an answer.", error });
    }
  },

  updateAnswer: async (req, res) => {
    const { id } = req.params;
    const { answerText, isCorrect } = req.body;

    try {
      const updatedAnswer = await Answer.findByIdAndUpdate(
        id,
        { answerText, isCorrect },
        { new: true }
      );

      if (!updatedAnswer) {
        return res.status(404).json({ message: "Answer not found" });
      }

      res
        .status(200)
        .json({ message: "Answer updated successfully", updatedAnswer });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteAnswer: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedAnswer = await Answer.findByIdAndDelete(id);

      if (!deletedAnswer) {
        return res.status(404).json({ message: "Answer not found" });
      }

      await Question.findByIdAndUpdate(deletedAnswer.question, {
        $pull: { answers: id },
      });

      res.status(200).json({ message: "Answer deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = answerControllers;
