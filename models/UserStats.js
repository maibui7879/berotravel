import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  edited_places: {
    count: { type: Number, default: 0 },
    places: [
      {
        place_id: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
        name: String,
        updated_at: Date
      }
    ]
  },

  reviews_created: {
    count: { type: Number, default: 0 },
    reviews: [
      {
        review_id: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
        place_id: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
        rating: Number,
        comment: String,
        created_at: Date
      }
    ]
  },

  votes_created: {
    count: { type: Number, default: 0 },
    votes: [
      {
        vote_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vote" },
        target_id: { type: mongoose.Schema.Types.ObjectId },
        target_type: { type: String, enum: ["Review", "Reply"] },
        vote_type: { type: String, enum: ["upvote", "downvote"] },
        created_at: Date
      }
    ]
  }

}, { timestamps: true });

export default mongoose.model("UserStats", userStatsSchema);
