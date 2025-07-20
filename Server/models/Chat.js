import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    file: {
      type: String, // For optional uploaded file (PDF, audio, etc.)
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.model('Chat', chatSchema);
