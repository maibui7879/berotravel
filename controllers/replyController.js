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
    const reply = await Reply.create({
      ...req.body,
      user_id: req.user._id
    });
    res.json(reply);
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
