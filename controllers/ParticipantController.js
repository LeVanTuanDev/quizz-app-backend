const Participant = require("../models/ParticipantModel.js");

const participantControllers = {
  createParticipant: async (req, res) => {
    const { name, studentId, quizResults } = req.body;
    try {
      const newParticipant = await Participant.create({
        name,
        studentId,
        quizResults,
      });
      res.status(201).json(newParticipant);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo Participant.", error });
    }
  },

  getAllParticipants: async (req, res) => {
    try {
      const participants = await Participant.find().populate("quizResults");
      res.status(200).json(participants);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách Participant.", error });
    }
  },

  getParticipantById: async (req, res) => {
    const { id } = req.params;
    try {
      const participant = await Participant.findById(id).populate(
        "quizResults"
      );
      if (!participant)
        return res.status(404).json({ message: "Participant không tồn tại." });
      res.status(200).json(participant);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy Participant.", error });
    }
  },

  updateParticipant: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedParticipant = await Participant.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      if (!updatedParticipant)
        return res.status(404).json({ message: "Participant không tồn tại." });
      res.status(200).json(updatedParticipant);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật Participant.", error });
    }
  },

  deleteParticipant: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedParticipant = await Participant.findByIdAndDelete(id);
      if (!deletedParticipant)
        return res.status(404).json({ message: "Participant không tồn tại." });
      res.status(200).json({ message: "Xóa Participant thành công." });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa Participant.", error });
    }
  },
};

module.exports = participantControllers;
