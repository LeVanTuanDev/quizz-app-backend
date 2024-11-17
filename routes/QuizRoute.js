const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/QuizController.js");

const router = require("express").Router();

router.post("/create", createQuiz);
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

module.exports = router;
