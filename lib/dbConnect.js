// lib/dbConnect.js
import mongoose from 'mongoose';

const globalWithMongoose = global;

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // If we already have a successful connection, return it.
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log('=> Reusing perfectly healthy DB connection');
    return cached.conn;
  }

  // If there's an ongoing connection attempt, wait for it, unless the readyState dropped.
  if (!cached.promise || mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
    console.log('🔌 Initiating NEW MongoDB connection...');
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((m) => {
      console.log('✅ MongoDB newly connected!');
      return m;
    }).catch(err => {
      console.error('❌ MongoDB Connection Error:', err);
      cached.promise = null; // RESET SO NEXT ATTEMPT RETRIES!
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
};

export default connectDB;