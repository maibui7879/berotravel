import mongoose from 'mongoose';

const JourneySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  places: [
    {
      place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
      },
      visited: {
        type: Boolean,
        default: false,
      },
    },
  ],
  status: {
    type: String,
    enum: ['ongoing', 'suspended', 'completed'],
    default: 'ongoing',
  },
}, {
  timestamps: true,
});

const Journey = mongoose.model('Journey', JourneySchema);

export default Journey;
