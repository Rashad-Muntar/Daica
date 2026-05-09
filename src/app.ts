import express from "express";
import type { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import basicAuth from "express-basic-auth";

// locallpath imports
import { config } from "./config/app.config.js";
import { requestId } from "./middleware/requestID.middleware.js";
import { swaggerSpec } from "./config/swagger.config.ts";
import { errorHandler } from "./middleware/error.middleware.ts"
import { notFoundHandler } from "./middleware/notFound.middleware.ts";

export function createApp(): Application {
  const app = express();

  // Trust proxy (for reverse proxies like nginx)
  app.set("trust proxy", 1);

  // Security headers
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: config.allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  );

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many requests, please try again later." },
    }),
  );

  // Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Compression
  app.use(compression());

  // Request ID
  app.use(requestId);

  // Routes
  const api = config.apiPrefix;
  // API Documentation

  app.use(
    `${api}/docs`,
    basicAuth({ users: { admin: "admin", wahab: "wahab" }, challenge: true }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec),
  );
  app.get(`${api}/docs.json`, (_req, res) => res.json(swaggerSpec));

  //   app.use(`${api}/health`, healthRouter);

//   404 handler
    app.use(notFoundHandler);

    // Global error handler (must be last)
    app.use(errorHandler);

  return app;
}
