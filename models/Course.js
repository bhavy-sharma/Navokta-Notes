// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  semester: { type: Number, required: true, unique: true },
  description: { type: String, required: false, default: '' } 
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', courseSchema);