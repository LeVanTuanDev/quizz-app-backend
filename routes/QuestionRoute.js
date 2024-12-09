const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  getQuestionByQuizId,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/QuestionController.js");
const { authenticateToken } = require("../middleware/auth.js");

const router = require("express").Router();

router.post("/create", authenticateToken, createQuestion);
router.get("/", getAllQuestions);
router.get("/:id", authenticateToken, getQuestionById);
router.get("/quiz/:id", authenticateToken, getQuestionByQuizId);
router.put("/:id", authenticateToken, updateQuestion);
router.delete("/:id", authenticateToken, deleteQuestion);

module.exports = router;
