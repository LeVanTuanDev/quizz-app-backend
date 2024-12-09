const {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
} = require("../controllers/AnswerController.js");
const authenticateToken = require("../middleware/auth.js");

const router = require("express").Router();

router.post("/create", authenticateToken, createAnswer);
router.get("/", getAllAnswers);
router.get("/:id", authenticateToken, getAnswerById);
router.put("/:id", authenticateToken, updateAnswer);
router.delete("/:id", authenticateToken, deleteAnswer);

module.exports = router;
