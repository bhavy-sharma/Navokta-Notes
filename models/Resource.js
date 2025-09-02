const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['pdf', 'video', 'pyq', 'link', 'other'], 
    required: true 
  },
  fileUrl: String, // Cloudinary URL for PDF
  youtubeUrl: String, // for videos
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Resource || mongoose.model('Resource', resourceSchema);