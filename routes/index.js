const express = require("express");
const router = express.Router();

const userRoute = require("./UserRoute");
const quizRoute = require("./QuizRoute");
const quizResultRoute = require("./QuizResultRoute");
const answerRoute = require("./AnswerRoute");
const questionRoute = require("./QuestionRoute");
const participantRoute = require("./ParticipantRoute");

router.use("/user", userRoute);
router.use("/quiz", quizRoute);
router.use("/quiz-result", quizResultRoute);
router.use("/answer", answerRoute);
router.use("/question", questionRoute);
router.use("/participant", participantRoute);

module.exports = router;
