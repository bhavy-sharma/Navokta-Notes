import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
 courseName:{type:String,requierd:ture},
 semester:{type:Number,requierd:ture},
 subject:{type:String,requierd:ture},
 pdf:{type:String,requierd:ture}
}, { timestamps: true });

export default mongoose.models.Resource || mongoose.model('Resource', resourceSchema);