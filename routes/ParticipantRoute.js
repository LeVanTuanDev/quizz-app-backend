const {
  createParticipant,
  getAllParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} = require("../controllers/ParticipantController.js");

const router = require("express").Router();

router.post("/create", createParticipant);
router.get("/", getAllParticipants);
router.get("/:id", getParticipantById);
router.put("/:id", updateParticipant);
router.delete("/:id", deleteParticipant);

module.exports = router;
