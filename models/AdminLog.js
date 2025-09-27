import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { 
    type: String, 
    required: true, 
    enum: ["create", "update", "delete", "register", "login", "logout"] 
  },
  targetType: { type: String, enum: ["Place", "Review", "User"], required: true },
  target: { type: mongoose.Schema.Types.ObjectId, refPath: "targetType" },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AdminLog", adminLogSchema);
