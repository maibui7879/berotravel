import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
