import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  target_id: { type: mongoose.Schema.Types.ObjectId }, // có thể là review_id hoặc reply_id
  target_type: { type: String, enum: ["Review", "Reply"] },
  vote_type: { type: String, enum: ["upvote", "downvote"] }
}, { timestamps: true });

export default mongoose.model("Vote", voteSchema);
