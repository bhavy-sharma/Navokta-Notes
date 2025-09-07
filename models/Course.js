import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  semester: { type: Number, required: true, unique: true },
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);