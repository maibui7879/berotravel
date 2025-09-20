import Vote from "../models/Vote.js";
import { updateUserStats } from "./userStatController.js";

export const createVote = async (req, res) => {
  try {
    const { target_id, target_type, vote_type } = req.body;
    const existing = await Vote.findOne({ user_id: req.user._id, target_id, target_type });

    if (existing) {
      existing.vote_type = vote_type;
      await existing.save();

      // Cập nhật thống kê user
      await updateUserStats(req.user._id);

      return res.json(existing);
    }

    const vote = await Vote.create({ user_id: req.user._id, target_id, target_type, vote_type });

    // Cập nhật thống kê user
    await updateUserStats(req.user._id);

    res.json(vote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVotes = async (req, res) => {
  try {
    const { target_id, target_type } = req.query;

    const votes = await Vote.find({ target_id, target_type });

    const up = votes.filter(v => v.vote_type === "upvote").length;
    const down = votes.filter(v => v.vote_type === "downvote").length;

    res.json({
      votes,
      summary: { up, down }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVote = async (req, res) => {
  try {
    const vote = await Vote.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    if (!vote) return res.status(404).json({ message: "Vote not found" });

    // Cập nhật thống kê user
    await updateUserStats(req.user._id);

    res.json({ message: "Vote deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
