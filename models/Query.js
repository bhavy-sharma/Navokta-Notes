// models/Query.js
import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'replied', 'resolved'],
    default: 'pending',
  },
  reply: {
    type: String,
    default: '',
  },
  repliedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Query || mongoose.model('Query', querySchema);