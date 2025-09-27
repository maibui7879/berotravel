import Vote from "../models/Vote.js";
import { updateUserStats } from "./userStatController.js";
import AdminLog from "../models/AdminLog.js";
import Notification from "../models/Notification.js";
import Review from "../models/Review.js";

export const createVote = async (req, res) => {
  try {
    const { target_id, target_type, vote_type } = req.body;

    let existing = await Vote.findOne({ user_id: req.user._id, target_id, target_type });

    if (existing) {
      existing.vote_type = vote_type;
      await existing.save();

      await updateUserStats(req.user._id);

      // Ghi log
      await AdminLog.create({
        user: req.user._id,
        action: "update",
        targetType: "Vote",
        target: target_id,
        description: `User ${req.user._id} updated vote (${vote_type}) on ${target_type} ${target_id}`
      });

      // Tạo notification nếu là review
      if (target_type === "review") {
        const review = await Review.findById(target_id);
        if (review && review.user_id.toString() !== req.user._id.toString()) {
          await Notification.create({
            user_id: review.user_id,
            message: `User ${req.user._id} đã ${vote_type} review của bạn`
          });
        }
      }

      return res.json(existing);
    }

    const vote = await Vote.create({ user_id: req.user._id, target_id, target_type, vote_type });

    await updateUserStats(req.user._id);

    // Ghi log
    await AdminLog.create({
      user: req.user._id,
      action: "create",
      targetType: "Vote",
      target: target_id,
      description: `User ${req.user._id} created vote (${vote_type}) on ${target_type} ${target_id}`
    });

    // Tạo notification nếu là review
    if (target_type === "review") {
      const review = await Review.findById(target_id);
      if (review && review.user_id.toString() !== req.user._id.toString()) {
        await Notification.create({
          user_id: review.user_id,
          message: `User ${req.user._id} đã ${vote_type} review của bạn`
        });
      }
    }

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

    await updateUserStats(req.user._id);

    // Ghi log
    await AdminLog.create({
      user: req.user._id,
      action: "delete",
      targetType: "Vote",
      target: vote.target_id,
      description: `User ${req.user._id} deleted vote on ${vote.target_type} ${vote.target_id}`
    });

    res.json({ message: "Vote deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
