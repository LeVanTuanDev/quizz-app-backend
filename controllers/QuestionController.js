const Question = require("../models/QuestionModel.js");
const Quiz = require("../models/QuizModel.js");

const questionControllers = {
  createQuestion: async (req, res) => {
    const { quiz, questionText } = req.body;

    try {
      const question = new Question(quiz, questionText);
      await question.save();

      await Quiz.findByIdAndUpdate(quizId, {
        $push: { questions: question._id },
        $inc: { questionCount: 1 },
      });

      res.status(201).json(question);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
    const { questionText, correctAnswer } = req.body;
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        id,
        { questionText, correctAnswer },
        { new: true }
      );

      if (!updatedQuestion) {
        return res.status(404).json({ message: "Question not found" });
      }

      res
        .status(200)
        .json({ message: "Question updated successfully", updatedQuestion });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteQuestion: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedQuestion = await Question.findByIdAndDelete(id);

      if (!deletedQuestion) {
        return res.status(404).json({ message: "Question not found" });
      }

      await Quiz.findByIdAndUpdate(deletedQuestion.quiz, {
        $pull: { questions: id },
        $inc: { questionCount: -1 },
      });

      res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = questionControllers;
