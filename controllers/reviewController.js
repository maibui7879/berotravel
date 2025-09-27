import Review from "../models/Review.js";
import sanitizeHtml from "sanitize-html";
import { updateUserStats } from "./userStatController.js";
import Vote from "../models/Vote.js";
import AdminLog from "../models/AdminLog.js";

// Lấy top 3 review theo vote
export const getReviewSortByVote = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user_id", "name avatar_url");
    const reviewsWithContent = reviews.filter(r => r.comment && r.comment.trim() !== "");
    const reviewIds = reviewsWithContent.map(r => r._id);

    const votes = await Vote.find({ target_id: { $in: reviewIds }, target_type: "review" });

    const voteMap = {};
    votes.forEach(v => {
      const id = v.target_id.toString();
      if (!voteMap[id]) voteMap[id] = 0;
      voteMap[id] += v.vote_type === "upvote" ? 1 : -1;
    });

    const reviewsWithScore = reviewsWithContent.map(r => ({
      ...r.toObject(),
      vote_score: voteMap[r._id.toString()] || 0
    }));

    reviewsWithScore.sort((a, b) => b.vote_score - a.vote_score);
    const top3 = reviewsWithScore.slice(0, 3);

    res.json(top3);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả review của place
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ place_id: req.params.placeId }).populate("user_id", "name avatar_url");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsCount = async (req, res) => {
  try {
    const count = await Review.countDocuments();
    res.json({ totalReviews: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo review mới
export const createReview = async (req, res) => {
  try {
    const cleanComment = sanitizeHtml(req.body.comment, {
      allowedTags: ["b", "i", "em", "strong", "a", "ul", "ol", "li", "p", "br"],
      allowedAttributes: { a: ["href", "target"] },
    });

    const review = await Review.create({
      rating: req.body.rating,
      comment: cleanComment,
      user_id: req.user._id,
      place_id: req.params.placeId,
      image_url: req.body.image_url || null,
    });

    await updateUserStats(req.user._id);

    await AdminLog.create({
      user: req.user._id,
      action: "create",
      targetType: "Review",
      target: review._id,
      description: `User ${req.user.name} đã tạo review cho place ${req.params.placeId}`
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật review
export const updateReview = async (req, res) => {
  try {
    const cleanComment = sanitizeHtml(req.body.comment, {
      allowedTags: ["b", "i", "em", "strong", "a", "ul", "ol", "li", "p", "br"],
      allowedAttributes: { a: ["href", "target"] },
    });

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { ...req.body, comment: cleanComment },
      { new: true }
    );

    if (!review) return res.status(404).json({ message: "Review not found" });

    await updateUserStats(req.user._id);

    await AdminLog.create({
      user: req.user._id,
      action: "update",
      targetType: "Review",
      target: review._id,
      description: `User ${req.user.name} đã cập nhật review ${review._id}`
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    if (!review) return res.status(404).json({ message: "Review not found" });

    await updateUserStats(req.user._id);

    await AdminLog.create({
      user: req.user._id,
      action: "delete",
      targetType: "Review",
      target: review._id,
      description: `User ${req.user.name} đã xóa review ${review._id}`
    });

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy rating trung bình + thống kê vote
export const getInitialRatingByPlace = async (req, res) => {
  try {
    const placeId = req.params.placeId;
    const reviews = await Review.find({ place_id: placeId }, "rating");

    if (!reviews.length) {
      return res.json({
        average: 0,
        totalVotes: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }

    const totalVotes = reviews.length;
    const sumRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = sumRating / totalVotes;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    res.json({
      average: Number(average.toFixed(2)),
      totalVotes,
      distribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
