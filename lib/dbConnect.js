// lib/dbConnect.js
import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'navokta_notes',
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('DB connection error:', error);
  }
};