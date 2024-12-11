const {
  participateInQuiz,
  getQuizResult,
  createParticipant,
  getAllParticipants,
  getParticipantById,
} = require("../controllers/ParticipantController.js");
const router = require("express").Router();

router.post("/participate", participateInQuiz);
router.get("/:participantId/:quizId", getQuizResult);
router.post("/create", createParticipant);
router.get("/", getAllParticipants);
router.get("/:id", getParticipantById);

module.exports = router;
