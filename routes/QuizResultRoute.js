const { calculateRate } = require("../controllers/QuizResultController.js");

const router = require("express").Router();

router.get("/:quizResultId", calculateRate);

module.exports = router;
