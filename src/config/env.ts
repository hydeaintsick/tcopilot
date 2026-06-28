import { z } from "zod";

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  MISTRAL_API_KEY: z.string().min(1),
  MISTRAL_MODEL: z.string().default("mistral-small-latest"),
  MISTRAL_TRANSCRIBE_MODEL: z.string().default("voxtral-mini-latest"),
  DATABASE_URL: z.string().min(1),
  WEBHOOK_SECRET: z.string().optional(),
  CRON_SECRET: z.string().min(1),
  PUBLIC_BASE_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) {
    return cached;
  }
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(
      `Invalid environment variables: ${JSON.stringify(result.error.format())}`
    );
  }
  cached = result.data;
  return cached;
}

/**
 * Lazy proxy: accessing `env.X` validates on first use (server-side) instead of
 * at import time, so the Next.js build (which never reads these) does not fail.
 */
export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    return getEnv()[prop as keyof Env];
  },
});
