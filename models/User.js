import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  avatar_url: String,
  cover_url: String,
  dob: String,
  bio: String,
  role: { type: String, default: "user" },
  status: { type: String, enum: ["active", "suspended"], default: "active" },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
