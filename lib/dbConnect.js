// lib/dbConnect.js
import mongoose from 'mongoose';

// For Next.js / Serverless compatibility
const globalWithMongoose = global;

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (globalWithMongoose.mongoose.conn) {
    console.log('=> using existing database connection');
    return globalWithMongoose.mongoose.conn;
  }

  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'navokta_notes',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }).then((mongoose) => {
      globalWithMongoose.mongoose.conn = mongoose;
      return mongoose;
    });
  }

  try {
    const conn = await globalWithMongoose.mongoose.promise;

    // Setup event listeners only once
    if (!globalWithMongoose.mongoose.listenersSetup) {
      setupConnectionListeners();
      globalWithMongoose.mongoose.listenersSetup = true;
    }

    console.log('✅ MongoDB connected:', conn.connection.host);
    return conn;
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection...');
      connectDB();
    }, 5000);
    throw error;
  }
};

function setupConnectionListeners() {
  mongoose.connection.on('disconnected', () => {
    console.log('❌ MongoDB disconnected. Trying to reconnect...');
    globalWithMongoose.mongoose.conn = null;
    setTimeout(connectDB, 5000);
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔁 MongoDB reconnected!');
    globalWithMongoose.mongoose.conn = mongoose;
  });
}

export default connectDB;