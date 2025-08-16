import mongoose from "mongoose";
// Load environment variables from .env.local
import dotenv from "dotenv";
import path from "path";

import "@/lib/models/user";
import "@/lib/models/collection";
import "@/lib/models/product";
import "@/lib/models/cart";
import "@/lib/models/order";
import "@/lib/models/webhook";
import "@/lib/models/contact";
import "@/lib/models/wholesale";

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB || undefined,
  });
  isConnected = true;
}
