const {
  createQuiz,
  createQuizFull,
  getAllQuizzes,
  getQuizById,
  getQuizByAuthor,
  updateQuiz,
  updateQuizFull,
  deleteQuiz,
} = require("../controllers/QuizController.js");
const { authenticateToken } = require("../middleware/auth.js");

const router = require("express").Router();

router.post("/create", authenticateToken, createQuiz);
router.post("/create-quiz", authenticateToken, createQuizFull);
router.get("/", getAllQuizzes);
router.get("/:id", authenticateToken, getQuizById);
router.get("/author/:id", authenticateToken, getQuizByAuthor);
router.put("/:id", authenticateToken, updateQuiz);
router.put("/update-quiz", authenticateToken, updateQuizFull);
router.delete("/:id", authenticateToken, deleteQuiz);

module.exports = router;
