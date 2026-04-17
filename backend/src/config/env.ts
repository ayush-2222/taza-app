import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(8000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default("*"),
  NEWS_PAGE_SIZE: z.coerce.number().default(10),
  SCROLL_FREEZE_LIMIT: z.coerce.number().default(12),
  UPLOAD_DIR: z.string().default("uploads")
});

export const env = envSchema.parse(process.env);

