import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  courseName: { type: String, required: true }, // Fixed: "requierd" -> "required"
  semester: { type: Number, required: true },   // Fixed: "requierd" -> "required"
  subject: { type: String, required: true },    // Fixed: "requierd" -> "required"
  fileType: { 
    type: String, 
    enum: ['PDF', 'YouTubeLink', 'ExternalLink'], 
    default: 'PDF'  
  },
  link: { type: String, required: true },
  dowloadedCount: { type: Number, default: 0 }    // Added: "default: 0" to track number of downloads
}, { timestamps: true });

export default mongoose.models.Resource || mongoose.model('Resource', resourceSchema);