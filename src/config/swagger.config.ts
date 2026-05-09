import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./app.config.ts";

//@ts-expect-error because I dont have controls
const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: config.appName,
      version: process.env.npm_package_version || "1.0.0",
      description: "API documentation",
    },
    servers: [{ url: `${config.appUrl}${config.apiPrefix}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis:
    process.env.NODE_ENV === "production"
      ? ["./dist/modules/**/*.routes.js"] // compiled JS in production
      : ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
