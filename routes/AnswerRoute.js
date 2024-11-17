const {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
} = require("../controllers/AnswerController.js");

const router = require("express").Router();

router.post("/create", createAnswer);
router.get("/", getAllAnswers);
router.get("/:id", getAnswerById);
router.put("/:id", updateAnswer);
router.delete("/:id", deleteAnswer);

module.exports = router;
