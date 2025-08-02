import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/brain-app";

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    console.log("Continuing without database connection for development...");
    // Don't throw error in development, just log it
    return Promise.resolve();
  }
}
