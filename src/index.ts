import Fastify from "fastify";
import cors from "@fastify/cors";
import { createBot, registerWebhook } from "./bot/index.js";
import { createServices } from "./config/container.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { createReminderScheduler } from "./scheduler/reminder.job.js";

async function main(): Promise<void> {
  const services = createServices();
  const bot = createBot(services);
  const scheduler = createReminderScheduler(bot, services);

  const app = Fastify({ logger: true });

  await app.register(cors);

  app.get("/health", async () => ({ status: "ok" }));

  app.post("/webhook", async (request, reply) => {
    if (env.WEBHOOK_SECRET) {
      const secret = request.headers["x-telegram-bot-api-secret-token"];
      if (secret !== env.WEBHOOK_SECRET) {
        return reply.status(403).send({ error: "Forbidden" });
      }
    }

    try {
      await bot.handleUpdate(
        request.body as Parameters<typeof bot.handleUpdate>[0],
      );
      return reply.status(200).send({ ok: true });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  await bot.init();
  scheduler.start();
  await registerWebhook(bot);

  await app.listen({ port: env.PORT, host: "0.0.0.0" });
  console.log(`Server listening on port ${env.PORT}`);

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`Received ${signal}, shutting down...`);
    scheduler.stop();
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
