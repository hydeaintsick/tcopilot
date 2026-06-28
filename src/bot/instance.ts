import { createBot, type BotContextType } from "./index";
import { createServices, type AppServices } from "../config/container";
import type { Bot } from "grammy";

interface BotCache {
  bot: Bot<BotContextType>;
  services: AppServices;
  ready: Promise<void>;
}

const globalForBot = globalThis as unknown as { __tcopilotBot?: BotCache };

/**
 * Returns a cached bot + services instance for the current serverless container.
 * `ready` resolves once `bot.init()` has completed (required before handling updates).
 */
export function getBotAndServices(): BotCache {
  if (!globalForBot.__tcopilotBot) {
    const services = createServices();
    const bot = createBot(services);
    globalForBot.__tcopilotBot = { bot, services, ready: bot.init() };
  }
  return globalForBot.__tcopilotBot;
}
