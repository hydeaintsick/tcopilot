import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  MISTRAL_API_KEY: z.string().min(1),
  MISTRAL_MODEL: z.string().default("mistral-small-latest"),
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().default(3000),
  WEBHOOK_URL: z.string().url(),
  WEBHOOK_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Invalid environment variables:", result.error.format());
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
