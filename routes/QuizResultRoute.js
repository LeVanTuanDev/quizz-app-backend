const {
  createQuizResult,
  getAllQuizResults,
  getQuizResultById,
  updateQuizResult,
  deleteQuizResult,
} = require("../controllers/QuizResultController.js");

const router = require("express").Router();

router.post("/create", createQuizResult);
router.get("/", getAllQuizResults);
router.get("/:id", getQuizResultById);
router.put("/:id", updateQuizResult);
router.delete("/:id", deleteQuizResult);

module.exports = router;
