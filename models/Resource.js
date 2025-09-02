// models/Resource.js
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['pdf', 'video', 'pyq', 'link', 'other'], 
    required: true 
  },
  fileUrl: String,
  youtubeUrl: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Resource || mongoose.model('Resource', resourceSchema);