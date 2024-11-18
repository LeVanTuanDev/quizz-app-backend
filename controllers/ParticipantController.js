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
      res.status(500).json({ message: "Lỗi khi tạo người tham gia.", error });
    }
  },

  getAllParticipants: async (req, res) => {
    try {
      const participants = await Participant.find().populate("quizResults");
      res.status(200).json(participants);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách người tham gia.", error });
    }
  },

  getParticipantById: async (req, res) => {
    const { id } = req.params;
    try {
      const participant = await Participant.findById(id).populate(
        "quizResults"
      );
      if (!participant)
        return res
          .status(404)
          .json({ message: "Người tham gia không tồn tại." });
      res.status(200).json(participant);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy người tham gia.", error });
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
        return res
          .status(404)
          .json({ message: "Người tham gia không tồn tại." });
      res.status(200).json(updatedParticipant);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật người tham gia.", error });
    }
  },

  deleteParticipant: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedParticipant = await Participant.findByIdAndDelete(id);
      if (!deletedParticipant)
        return res
          .status(404)
          .json({ message: "Người tham gia không tồn tại." });
      res.status(200).json({ message: "Xóa người tham gia thành công." });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa người tham gia.", error });
    }
  },
};

module.exports = participantControllers;
