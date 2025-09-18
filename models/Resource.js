// models/Resource.js (example)
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  courseName: { type: String, required: true },
  semester: { type: Number, required: true },
  fileType: { 
    type: String, 
    enum: ["PDF", "YouTubeLink", "ExternalLink"], 
    required: true 
  },
  link: { type: String, required: true }, // Appwrite URL or YouTube/External link
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Resource || mongoose.model("Resource", resourceSchema);