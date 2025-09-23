// lib/dbConnect.js
import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'navokta_notes',
      // Optional: Add some connection options for better stability
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
    });

    isConnected = true;
    console.log('✅ MongoDB connected:', conn.connection.host);

    // Listen for disconnection
    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB disconnected. Trying to reconnect...');
      isConnected = false;
      // Auto-reconnect after 5 seconds
      setTimeout(connectDB, 5000);
    });

    // Listen for errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    // Optional: Listen for successful reconnection
    mongoose.connection.on('reconnected', () => {
      console.log('🔁 MongoDB reconnected!');
      isConnected = true;
    });

  } catch (error) {
    console.error('❌ DB connection failed:', error.message);

    // Retry after 5 seconds if connection fails
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection...');
      connectDB();
    }, 5000);
  }
};

export default connectDB;