// lib/dbConnect.js
import mongoose from "mongoose";

const globalWithMongoose = global;

let cached = globalWithMongoose.mongoose;

<<<<<<< HEAD
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
      dbName: 'Navokta-Notes',
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
=======
async function setupConnectionListeners() {
  mongoose.connection.on("disconnected", () => {
    console.log("❌ MongoDB disconnected. Will reconnect on next request.");
    globalWithMongoose.mongoose.conn = null;
    globalWithMongoose.mongoose.promise = null; // 👈 important: reset promise
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
    globalWithMongoose.mongoose.conn = null;
    globalWithMongoose.mongoose.promise = null; // 👈 retry allowed on next call
  });
}

export const connectDB = async () => {
  // ✅ Agar already connection hai → reuse
  if (globalWithMongoose.mongoose.conn) {
    console.log("=> Reusing cached DB connection");
    return globalWithMongoose.mongoose.conn;
  }
 // ✅ Agar promise already chal rahi hai → wait for it
  if (!globalWithMongoose.mongoose.promise) {
    const uri = process.env.MONGODB_URI;
    

    globalWithMongoose.mongoose.promise = mongoose
      .connect(uri, {
        dbName: "Navokta-Notes",
        serverSelectionTimeoutMS: 20000, // ⬆ bigger timeout
        socketTimeoutMS: 45000,
      })
      .then(async (mongooseInstance) => {
        await setupConnectionListeners(); // only once
        globalWithMongoose.mongoose.conn = mongooseInstance;
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ Initial MongoDB connection failed:", err.message);
        globalWithMongoose.mongoose.promise = null; // reset promise
        throw err;
      });
  }

  try {
    const conn = await globalWithMongoose.mongoose.promise;
    console.log("✅ MongoDB connected:", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    throw error;
>>>>>>> 8b17375 (cloud storge)
  }
};

export default connectDB;
