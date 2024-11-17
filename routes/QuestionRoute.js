const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/QuestionController.js");

const router = require("express").Router();

router.post("/create", createQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;
