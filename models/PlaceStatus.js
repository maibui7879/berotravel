import mongoose from 'mongoose';

const placeStatusSchema = new mongoose.Schema({
  place_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },
  initial_status: {
    type: String,
    enum: ['open', 'closed'],
    required: true,
  },
  opening_time: String,
  closing_time: String,
  // hotel-specific fields
  available_status: {
    type: String,
    enum: ['available', 'unavailable'],
  },
  available_rooms: Number,
  price: Number,
  contact: String,
}, { timestamps: true });

export default mongoose.model('PlaceStatus', placeStatusSchema);
