import { createBot, configureBotCommands, type BotContextType } from "./index";
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
    const ready = bot.init().then(async () => {
      // Le menu de commandes ne dépend pas de l'utilisateur : on le déclare une
      // seule fois au démarrage du conteneur (échec non bloquant).
      await configureBotCommands(bot).catch((error) => {
        console.error("setMyCommands failed:", error);
      });
    });
    globalForBot.__tcopilotBot = { bot, services, ready };
  }
  return globalForBot.__tcopilotBot;
}
