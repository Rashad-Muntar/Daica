// import "dotenv/config";
// import { createApp } from "./app";
// import { config } from "./config/app.config";
// import { logger } from "./utils/logger";
// import { connectMongoDB, disconnectMongoDB } from "./db/db_setup";

// async function bootstrap() {
//   const app = createApp();
//   try {
//     await connectMongoDB();
//     logger.info("✅ MongoDB connected");
//   } catch (err) {
//     logger.error({ err }, "❌ Failed to connect to MongoDB");
//     process.exit(1);
//   }

//   const server = app.listen(config.port, () => {
//     logger.info(
//       `🚀 isppots_backend running at http://localhost:${config.port}`,
//     );
//     logger.info(`   ENV: ${config.nodeEnv}`);
//     logger.info(`   API: http://localhost:${config.port}${config.apiPrefix}`);
//     logger.info(`   Docs: http://localhost:${config.port}/docs`);
//   });

//   // Graceful shutdown
//   const shutdown = async (signal: string) => {
//     logger.info(`Received ${signal}, shutting down gracefully...`);

//     server.close(async () => {
//       await disconnectMongoDB();
//       logger.info("Server closed");
//       process.exit(0);
//     });
//   };

//   process.on("SIGTERM", () => shutdown("SIGTERM"));
//   process.on("SIGINT", () => shutdown("SIGINT"));

//   process.on("unhandledRejection", (reason) => {
//     logger.error({ reason }, "Unhandled Promise Rejection");
//     process.exit(1);
//   });

//   process.on("uncaughtException", (err) => {
//     logger.fatal({ err }, "Uncaught Exception");
//     process.exit(1);
//   });
// }

// bootstrap();

import "dotenv/config";
import { createApp } from "./app";
import { config } from "./config/app.config";
import { logger } from "./utils/logger";
import { connectMongoDB, disconnectMongoDB } from "./db/db_setup";
// import { ConversationStateService } from "./modules/conversation/conversation.service";

async function bootstrap() {
  const app = createApp();

  try {
    await connectMongoDB();
    logger.info("✅ MongoDB connected");
  } catch (err) {
    logger.error({ err }, "❌ Failed to connect to MongoDB");
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    logger.info(
      `🚀 isppots_backend running at http://localhost:${config.port}`,
    );
    logger.info(`   ENV: ${config.nodeEnv}`);
    logger.info(`   API: http://localhost:${config.port}${config.apiPrefix}`);
    logger.info(`   Docs: http://localhost:${config.port}/docs`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    server.close(async () => {
      // const { disconnectMongoDB } = await import('./db/mongoose');
      await disconnectMongoDB();
      // const { redis } = await import('./utils/redis');
      // await redis.quit();
      logger.info("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled Promise Rejection");
    process.exit(1);
  });

  process.on("uncaughtException", (err) => {
    logger.fatal({ err }, "Uncaught Exception");
    process.exit(1);
  });
}

bootstrap();
