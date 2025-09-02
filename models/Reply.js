import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  review_id: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  parent_reply_id: { type: mongoose.Schema.Types.ObjectId, ref: "Reply", default: null },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String
}, { timestamps: true });

export default mongoose.model("Reply", replySchema);
