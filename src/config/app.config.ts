import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  APP_NAME: z.string().default("isppots_backend"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  API_PREFIX: z.string().default("/api/v1"),
  SECRET_KEY: z.string().min(32),
  ALLOWED_ORIGINS: z
    .string()
    .transform((v) => v.split(",").map((s) => s.trim())),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  DATABASE_URI: z.string(),
  META_WA_SENDERPHONENUMBER_ID: z.string(),
  META_WA_VERIFYTOKEN: z.string(),
  META_WA_ACCESSTOKEN: z.string(),
  META_WA_WABAID: z.string(),
  GROQ_API_KEY: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const config = {
  nodeEnv: env.NODE_ENV,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "test",
  port: env.PORT,
  appName: env.APP_NAME,
  appUrl: env.APP_URL,
  apiPrefix: env.API_PREFIX,
  secretKey: env.SECRET_KEY,
  allowedOrigins: env.ALLOWED_ORIGINS,
  logLevel: env.LOG_LEVEL,
  WaAccessToken: env.META_WA_ACCESSTOKEN,
  WaSenderPhoneNumberId: env.META_WA_SENDERPHONENUMBER_ID,
  WaVerifytoken: env.META_WA_VERIFYTOKEN,
  WaWabaId: env.META_WA_WABAID,
  databaseUrl: env.DATABASE_URI,
  AIApiKey: env.GROQ_API_KEY,
  cloudinaryName: env.CLOUDINARY_CLOUD_NAME,
  cloudinaryKey: env.CLOUDINARY_API_KEY,
  cloudinarySecret: env.CLOUDINARY_API_SECRET,
} as const;
