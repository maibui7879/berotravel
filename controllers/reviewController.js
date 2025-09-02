import Review from "../models/Review.js";

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ place_id: req.params.placeId })
      .populate("user_id", "name avatar_url");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const review = await Review.create({
      ...req.body,
      user_id: req.user._id
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Hàm mới: lấy rating trung bình + thống kê vote
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

    // Đếm số lượng theo từng điểm
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
