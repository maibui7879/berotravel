import Review from "../models/Review.js";
import sanitizeHtml from "sanitize-html";

// Lấy tất cả reviews của một place
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ place_id: req.params.placeId })
      .populate("user_id", "name avatar_url");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo review mới (rich text comment)
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

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật review (rich text comment)
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
