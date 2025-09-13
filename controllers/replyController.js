import Reply from "../models/Reply.js";

export const getReplies = async (req, res) => {
  try {
    const replies = await Reply.find({ review_id: req.params.reviewId })
      .populate("user_id", "name avatar_url");
    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReply = async (req, res) => {
  try {
    const { review_id, content, parent_reply_id } = req.body;
    const user_id = req.user._id;  // Người dùng đang trả lời bình luận

    // Tạo reply mới
    const reply = await Reply.create({
      review_id,
      parent_reply_id,
      user_id,
      content
    });

    const review = await Review.findById(review_id);
    const userReplyingTo = review.user_id;  

    if (userReplyingTo.toString() !== user_id.toString()) {
      const notificationMessage = `Bạn có một phản hồi mới từ ${req.user.name} trong bình luận của bạn.`;
      await Notification.create({
        user_id: userReplyingTo,
        message: notificationMessage
      });
    }

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReply = async (req, res) => {
  try {
    const reply = await Reply.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true }
    );
    if (!reply) return res.status(404).json({ message: "Reply not found" });
    res.json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const reply = await Reply.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    if (!reply) return res.status(404).json({ message: "Reply not found" });
    res.json({ message: "Reply deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
