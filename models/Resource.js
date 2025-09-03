import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'video', 'pyq', 'link'], required: true },
  fileUrl: String,
  youtubeUrl: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Number, required: true, min: 1, max: 10 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Resource || mongoose.model('Resource', resourceSchema);