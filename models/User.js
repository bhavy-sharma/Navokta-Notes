import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
  },
  isVerified: {
  type: Boolean,
  default: false,
},
otp: {
  type: String,
  default: null,
},
otpExpires: {
  type: Date,
  default: null,
},
  role: { 
    type: String, 
    default: 'user', 
    enum: ['user', 'admin'] 
  },
  avatar: {
    type: String,
    default: '',
  },
}, { 
  timestamps: true 
});

export default mongoose.models.User || mongoose.model('User', userSchema);