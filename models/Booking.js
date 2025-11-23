
import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Place',
    },
    numberOfPeople: {
      type: Number,
      required: true,
    },
    bookingDateTime: {
      type: Date,
      required: true,
    },
    checkoutDateTime: {
      type: Date,
    },
    totalPrice: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
