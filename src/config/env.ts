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

  // --- Abonnement (Telegram Stars) ---
  // Prix mensuel de l'abonnement, en Stars (Telegram facture en ⭐, pas en USD).
  // ~150 ⭐ ≈ 2,99 USD selon la conversion. Max autorisé par Telegram : 10000.
  STARS_PRICE: z.coerce.number().int().min(1).max(10000).default(150),
  // Identifiants Telegram des admins (séparés par des virgules). Ils ont l'accès
  // gratuit et sont les seuls à pouvoir utiliser /grant et /revoke.
  ADMIN_USER_IDS: z.string().optional().default(""),
  // Durée de l'essai gratuit en jours pour les nouveaux utilisateurs (0 = aucun).
  FREE_TRIAL_DAYS: z.coerce.number().int().min(0).default(0),
});

export type Env = z.infer<typeof envSchema>;

/** Parse ADMIN_USER_IDS ("123,456") en un ensemble de BigInt. */
export function getAdminUserIds(): Set<bigint> {
  const raw = getEnv().ADMIN_USER_IDS;
  const ids = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s))
    .map((s) => BigInt(s));
  return new Set(ids);
}

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
