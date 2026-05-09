import type { Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger.ts";
import { AppError } from "../utils/errors.ts";
import { config } from "../config/app.config.ts";

export function errorHandler(err: Error, req: Request, res: Response): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(422).json({
      status: "error",
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  // Application errors (operational)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  // Unknown errors
  logger.error(
    {
      err,
      req: {
        method: req.method,
        url: req.url,
        requestId: res.locals.requestId,
      },
    },
    "Unhandled error",
  );

  res.status(500).json({
    status: "error",
    message: "Internal server error",
    ...(config.isDevelopment && { stack: err.stack }),
  });
}
