import mongoose from "mongoose";

// Cache the connection to avoid multiple connections in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("MONGODB_URI is not set in environment variables");
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  // If already connected, return the existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If there's already a connection promise, wait for it
  if (cached.promise) {
    return cached.promise;
  }

  // Create new connection with optimized settings for serverless
  const opts = {
    bufferCommands: false,
    maxPoolSize: 1, // Reduced for serverless
    minPoolSize: 0, // Allow connection to close when idle
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    serverSelectionTimeoutMS: 10000, // Increased timeout
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000, // Connection timeout
    family: 4,
    retryWrites: true,
    retryReads: true,
  };

  cached.promise = mongoose
    .connect(mongoUri, opts)
    .then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      cached.promise = null;
      throw error;
    });

  cached.conn = await cached.promise;
  return cached.conn;
};
