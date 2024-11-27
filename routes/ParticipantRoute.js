const {
  participateInQuiz,
  getQuizResult,
} = require("../controllers/ParticipantController.js");

const router = require("express").Router();

router.post("/participate", participateInQuiz);
router.get("/:participantId/:quizId", getQuizResult);

module.exports = router;
