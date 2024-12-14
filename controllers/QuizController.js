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
        let correctAnswer = null;

        for (const a of q.answers) {
          const answer = new Answer({
            question: question._id,
            answerText: a.answerText,
            isCorrect: a.isCorrect,
          });
          await answer.save({ session }); // Tạo Answer
          answerIds.push(answer._id);

          // Gán correctAnswer nếu isCorrect là true
          if (a.isCorrect) {
            correctAnswer = answer._id;
          }
        }

        // Gán thông tin câu trả lời đúng và danh sách câu trả lời vào Question
        question.answers = answerIds;
        question.correctAnswer = correctAnswer;
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

  getQuizByAuthor: async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) {
        return res
          .status(400)
          .json({ message: "Author ID (createdBy) is required." });
      }
      const quizzes = await Quiz.find({ createdBy: id }).populate("createdBy");
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // updateQuiz: async (req, res) => {
  //   const { id } = req.params;
  //   const { questions } = req.body;

  //   try {
  //     const quiz = await Quiz.findById(id);
  //     if (!quiz) return res.status(404).json({ message: "Quiz not found." });

  //     if (questions) {
  //       quiz.questions = questions;
  //       quiz.questionCount = questions.length;
  //     }

  //     Object.assign(quiz, req.body);

  //     const updatedQuiz = await quiz.save();
  //     res.status(200).json(updatedQuiz);
  //   } catch (error) {
  //     res.status(500).json({ message: "Error when updating a quiz.", error });
  //   }
  // },

  updateQuizFull: async (req, res) => {
    const { quizId, title, questions } = req.body;

    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      quiz.title = title || quiz.title;

      for (const questionData of questions) {
        const { questionId, questionText, answers } = questionData;

        let question;

        if (questionId) {
          question = await Question.findById(questionId);
          if (!question) {
            return res
              .status(404)
              .json({ message: `Question with ID ${questionId} not found` });
          }
          question.questionText = questionText || question.questionText;
        } else {
          question = new Question({
            quiz: quizId,
            questionText,
          });
          quiz.questions.push(question._id);
        }

        for (const answerData of answers) {
          const { answerId, answerText, isCorrect } = answerData;

          if (answerId) {
            const answer = await Answer.findById(answerId);
            if (!answer) {
              return res
                .status(404)
                .json({ message: `Answer with ID ${answerId} not found` });
            }
            answer.answerText = answerText || answer.answerText;
            answer.isCorrect =
              isCorrect !== undefined ? isCorrect : answer.isCorrect;
            await answer.save();
          } else {
            const newAnswer = new Answer({
              question: question._id,
              answerText,
              isCorrect,
            });
            await newAnswer.save();
            question.answers.push(newAnswer._id);
          }
        }

        await question.save();
      }
      await quiz.save();

      return res
        .status(200)
        .json({ message: "Quiz, questions, and answers updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "An error occurred while updating the quiz",
        error: error.message,
      });
    }
  },

  // {
  //   "quizId": "_id",
  //   "title": "Updated Title",
  //   "questions": [
  //     {
  //       "questionId": "_id", // Có question Id thì sẽ cập nhật
  //       "questionText": "Updated Question Text?",
  //       "answers": [
  //         {
  //           "answerId": "_id",
  //           "answerText": "Updated Answer Text 1",
  //           "isCorrect": true
  //         },
  //         {
  //           "answerId": "_id",
  //           "answerText": "Updated Answer Text 2",
  //           "isCorrect": false
  //         }
  //       ]
  //     },
  //     {
  //       "questionText": "New Question Text?", // Không có question Id thì sẽ tạo mới
  //       "answers": [
  //         {
  //           "answerText": "New Answer Text 1",
  //           "isCorrect": true
  //         },
  //         {
  //           "answerText": "New Answer Text 2",
  //           "isCorrect": false
  //         }
  //       ]
  //     }
  //   ]
  // }

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
