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
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
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
