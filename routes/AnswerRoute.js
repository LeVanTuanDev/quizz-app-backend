const {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
} = require("../controllers/AnswerController.js");
const { authenticateToken } = require("../middleware/auth.js");

const router = require("express").Router();

router.post("/create", authenticateToken, createAnswer);
router.get("/", getAllAnswers);
router.get("/:id", authenticateToken, getAnswerById);
router.get("/question/:id", authenticateToken, getAnswersByQuestionId);
router.put("/:id", authenticateToken, updateAnswer);
router.delete("/:id", authenticateToken, deleteAnswer);

module.exports = router;
