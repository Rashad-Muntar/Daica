import mongoose from "mongoose";
import { logger } from "../config/logger";
import { config } from "@/config/app.config";

const MONGODB_URI = config.databaseUrl || "mongodb://localhost:27017/isppots";

let isConnected = false;

export async function connectMongoDB(): Promise<void> {
  if (isConnected) {
    logger.debug("MongoDB already connected");
    return;
  }

  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    logger.info("MongoDB connection established");
    isConnected = true;
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
    isConnected = false;
  });

  mongoose.connection.on("error", (err) => {
    logger.error({ err }, "MongoDB connection error");
    isConnected = false;
  });

  await mongoose.connect(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
}

export async function disconnectMongoDB(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info("MongoDB disconnected gracefully");
}

export { mongoose };
