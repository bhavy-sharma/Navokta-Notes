// models/Resource.js
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  semester: { type: Number, required: true },
  subject: { type: String, required: true },
  fileType: { type: String, required: true },
  link: { type: String, required: true },
  // ✅ Initialize downloadedCount to 0 if not set
  downloadedCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.models.Resource || mongoose.model('Resource', resourceSchema);