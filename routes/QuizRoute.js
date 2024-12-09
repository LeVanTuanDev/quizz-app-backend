const {
  createQuiz,
  createQuizFull,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/QuizController.js");
const { authenticateToken } = require("../middleware/auth.js");

const router = require("express").Router();

router.post("/create", authenticateToken, createQuiz);
router.post("/create-quiz", createQuizFull);
router.get("/", getAllQuizzes);
router.get("/:id", authenticateToken, getQuizById);
router.put("/:id", authenticateToken, updateQuiz);
router.delete("/:id", authenticateToken, deleteQuiz);

module.exports = router;
