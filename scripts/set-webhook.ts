import { Bot } from "grammy";

// Load .env (Node 22+) so the script works locally without extra flags.
try {
  (process as NodeJS.Process & { loadEnvFile?: (path?: string) => void }).loadEnvFile?.();
} catch {
  // No .env file present — rely on the ambient environment instead.
}

async function main(): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.WEBHOOK_SECRET;
  const baseUrl = process.argv[2] ?? process.env.PUBLIC_BASE_URL;

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN manquant (env ou .env).");
  }
  if (!baseUrl) {
    throw new Error(
      "URL de base manquante. Usage: npm run set-webhook -- https://mon-app.vercel.app"
    );
  }

  const url = `${baseUrl.replace(/\/+$/, "")}/api/telegram/webhook`;
  const bot = new Bot(token);

  await bot.api.setWebhook(url, secret ? { secret_token: secret } : undefined);
  console.log(`Webhook enregistré: ${url}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
