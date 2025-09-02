import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  place_id: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  image_url: String
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
