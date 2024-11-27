const {
  saveQuizResult,
  calculateRate,
} = require("../controllers/QuizResultController.js");

const router = require("express").Router();

router.post("/", saveQuizResult);
router.get("/:quizResultId", calculateRate);

module.exports = router;
