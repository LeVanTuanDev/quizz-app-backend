const {
  calculateRate,
  getQuizResultByQuizId,
} = require("../controllers/QuizResultController.js");

const router = require("express").Router();

router.get("/:quizResultId", calculateRate);
router.get("/quiz/:quizId", getQuizResultByQuizId);

module.exports = router;
