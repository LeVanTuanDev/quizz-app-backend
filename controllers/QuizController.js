const Quiz = require("../models/QuizModel.js");
const Question = require("../models/QuestionModel.js");
const Answer = require("../models/AnswerModel.js");

const quizControllers = {
  createQuiz: async (req, res) => {
    const { title, createdBy } = req.body;
    try {
      const quiz = new Quiz({ title, createdBy });
      await quiz.save();
      res.status(201).json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createQuizFull: async (req, res) => {
    const { title, createdBy, questions } = req.body;

    const session = await Quiz.startSession();
    session.startTransaction();

    try {
      const quiz = new Quiz({ title, createdBy });
      await quiz.save({ session }); // Tạo Quiz

      const questionIds = [];
      for (const q of questions) {
        const question = new Question({
          quiz: quiz._id,
          questionText: q.questionText,
        });
        await question.save({ session }); // Tạo Question

        questionIds.push(question._id);

        const answerIds = [];
        for (const a of q.answers) {
          const answer = new Answer({
            question: question._id,
            answerText: a.answerText,
            isCorrect: a.isCorrect,
          });
          await answer.save({ session }); // Tạo Answer
          answerIds.push(answer._id);
        }

        question.answers = answerIds;
        await question.save({ session });
      }

      quiz.questions = questionIds;
      quiz.questionCount = questionIds.length;
      await quiz.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        message: "Quiz created successfully.",
        quiz,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ error: error.message });
    }
  },

  // Mẫu Request
  // {
  //   "title": "Math Quiz",
  //   "createdBy": "674b1ea4ac0cba192d1503d8",
  //   "questions": [
  //     {
  //       "questionText": "What is 2 + 2?",
  //       "answers": [
  //         { "answerText": "3", "isCorrect": false },
  //         { "answerText": "4", "isCorrect": true }
  //       ]
  //     },
  //     {
  //       "questionText": "What is 3 + 5?",
  //       "answers": [
  //         { "answerText": "7", "isCorrect": false },
  //         { "answerText": "8", "isCorrect": true }
  //       ]
  //     }
  //   ]
  // }

  getAllQuizzes: async (req, res) => {
    try {
      const quizzes = await Quiz.find().populate("createdBy");
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getQuizById: async (req, res) => {
    const { id } = req.params;
    try {
      const quiz = await Quiz.findById(id)
        .populate("questions")
        .populate("createdBy");
      if (!quiz) return res.status(404).json({ message: "Quiz not found." });
      res.status(200).json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateQuiz: async (req, res) => {
    const { id } = req.params;
    const { questions } = req.body;

    try {
      const quiz = await Quiz.findById(id);
      if (!quiz) return res.status(404).json({ message: "Quiz not found." });

      if (questions) {
        quiz.questions = questions;
        quiz.questionCount = questions.length;
      }

      Object.assign(quiz, req.body);

      const updatedQuiz = await quiz.save();
      res.status(200).json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ message: "Error when updating a quiz.", error });
    }
  },

  deleteQuiz: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedQuiz = await Quiz.findByIdAndDelete(id);
      if (!deletedQuiz)
        return res.status(404).json({ message: "Quiz not found." });
      res.status(200).json({ message: "Deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error when deleting a quiz.", error });
    }
  },
};

module.exports = quizControllers;
