import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  avatar_url: String,
  role: { type: String, default: "user" },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
