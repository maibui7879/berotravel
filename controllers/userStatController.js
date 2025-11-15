import mongoose from "mongoose";
import UserStats from "../models/UserStats.js";
import Place from "../models/Place.js";
import Review from "../models/Review.js";
import Vote from "../models/Vote.js";

export const updateUserStats = async (userIdParam) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userIdParam)) {
      throw new Error("Invalid user ID");
    }
    const userId = new mongoose.Types.ObjectId(userIdParam);

    const places = await Place.find({ updated_by: userId });
    const editedPlaces = places.map(p => ({
      place_id: p._id,
      name: p.name,
      updated_at: p.updatedAt
    }));

    const reviews = await Review.find({ user_id: userId });
    const reviewList = reviews.map(r => ({
      review_id: r._id,
      place_id: r.place_id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.createdAt
    }));

    const votes = await Vote.find({ user_id: userId });
    const voteList = votes.map(v => ({
      vote_id: v._id,
      target_id: v.target_id,
      target_type: v.target_type,
      vote_type: v.vote_type,
      created_at: v.createdAt
    }));

    const stats = await UserStats.findOneAndUpdate(
      { user_id: userId },
      {
        edited_places: { count: editedPlaces.length, places: editedPlaces },
        reviews_created: { count: reviewList.length, reviews: reviewList },
        votes_created: { count: voteList.length, votes: voteList }
      },
      { new: true, upsert: true }
    );

    return stats;
  } catch (error) {
    console.error("updateUserStats error:", error.message);
    throw error;
  }
};

export const getMyStats = async (req, res) => {
  try {
    const userId = req.user._id;

    let stats = await UserStats.findOne({ user_id: userId })
      .populate("user_id", "name email avatar_url");

    if (!stats) {
      stats = await updateUserStats(userId);
      stats = await stats.populate("user_id", "name email avatar_url");
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserStatsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    let stats = await UserStats.findOne({ user_id: id })
      .populate("user_id", "name email avatar_url");

    if (!stats) {
      stats = await updateUserStats(id);
      stats = await stats.populate("user_id", "name email avatar_url");
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
