// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true, lowercase: true },
  totalSemesters: { type: Number, required: true, min: 1, max: 10 },
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', courseSchema);