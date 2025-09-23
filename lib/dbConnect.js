// lib/dbConnect.js
import mongoose from 'mongoose';

const globalWithMongoose = global;

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function setupConnectionListeners() {
  mongoose.connection.on('disconnected', () => {
    console.log('❌ MongoDB disconnected. Will reconnect on next request.');
    globalWithMongoose.mongoose.conn = null;
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
}

export const connectDB = async () => {
  // 👇 Serverless ke liye — har baar naya connection ya existing reuse
  if (globalWithMongoose.mongoose.conn) {
    console.log('=> Reusing cached DB connection');
    return globalWithMongoose.mongoose.conn;
  }

  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'Navokta-Notes',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }).then(async (mongooseInstance) => {
      await setupConnectionListeners(); // Setup listeners once
      globalWithMongoose.mongoose.conn = mongooseInstance;
      return mongooseInstance;
    });
  }

  try {
    const conn = await globalWithMongoose.mongoose.promise;
    console.log('✅ MongoDB connected:', conn.connection.host);
    return conn;
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    throw error;
  }
};

export default connectDB;