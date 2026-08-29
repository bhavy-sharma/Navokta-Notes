import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["1.1.1.1", "1.0.0.1"]);
dns.setDefaultResultOrder("ipv4first");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env.local file");
}

// Global mongoose cache
const globalForMongoose = globalThis;

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = {
    conn: null,
    promise: null,
    listenersAttached: false,
  };
}

const cached = globalForMongoose.mongoose;

export const connectDB = async () => {
  // Already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log("=> Reusing cached DB connection");
    return cached.conn;
  }

  // Connection attempt already running
  if (!cached.promise) {
    console.log("=> Creating new MongoDB connection...");

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "Navokta-Notes",

        serverSelectionTimeoutMS: 20000,

        socketTimeoutMS: 45000,
      })
      .then((mongooseInstance) => {
        console.log(
          "✅ MongoDB connected:",
          mongooseInstance.connection.host
        );

        cached.conn = mongooseInstance;

        return mongooseInstance;
      })
      .catch((error) => {
        console.error(
          "❌ MongoDB connection failed:",
          error.message
        );

        cached.conn = null;
        cached.promise = null;

        throw error;
      });
  }

  try {
    const conn = await cached.promise;

    return conn;
  } catch (error) {
    cached.conn = null;
    cached.promise = null;

    throw error;
  }
};

// Attach listeners only once
if (!cached.listenersAttached) {
  cached.listenersAttached = true;

  mongoose.connection.on("disconnected", () => {
    console.log(
      "❌ MongoDB disconnected. Will reconnect on next request."
    );

    cached.conn = null;
    cached.promise = null;
  });

  mongoose.connection.on("error", (error) => {
    console.error(
      "❌ MongoDB connection error:",
      error.message
    );

    cached.conn = null;
    cached.promise = null;
  });
}

export default connectDB;