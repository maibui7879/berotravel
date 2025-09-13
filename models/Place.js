import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: String,
  category: String,
  image_url: String,
  img_set: [String],
  contact: {
    phone: String,
    email: String
  },
  favorite_count: { type: Number, default: 0 },
  updated_by: { type: String } // ➕ tên người cập nhật cuối cùng
}, { timestamps: true });

export default mongoose.model("Place", placeSchema);
