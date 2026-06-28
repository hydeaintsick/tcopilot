import { Bot, Context, InlineKeyboard, session } from "grammy";
import type { AppServices } from "../config/container";
import { resolveBotContext } from "../config/container";
import { env } from "../config/env";
import type { BotContext as AppBotContext, ConversationMessage, PendingAmbiguous, TaskSummary } from "../types/intent";
import { PrismaSessionStorage } from "./session-storage";

const HISTORY_MAX = 6; // 3 échanges user/assistant

interface SessionData {
  lastTaskId?: string;
  history: ConversationMessage[];
  pendingAmbiguous?: PendingAmbiguous;
}

export type BotContextType = Context & {
  session: SessionData;
  appServices: AppServices;
  appContext: AppBotContext;
};

function extractTaskIdFromReply(ctx: BotContextType): string | null {
  const replyText = ctx.message?.reply_to_message?.text;
  if (!replyText) {
    return null;
  }

  const match = replyText.match(/\[id:([a-z0-9]+)\]/i);
  return match?.[1] ?? null;
}

function pushHistory(session: SessionData, userText: string, botText: string): void {
  session.history.push({ role: "user", content: userText });
  session.history.push({ role: "assistant", content: botText });
  if (session.history.length > HISTORY_MAX) {
    session.history = session.history.slice(-HISTORY_MAX);
  }
}

function resolveDisambiguation(text: string, tasks: TaskSummary[]): TaskSummary[] | null {
  const t = text.toLowerCase().trim();

  if (/^(les deux|les 2|tous|toutes|tout|les deux|all)$/.test(t)) {
    return tasks;
  }
  const indexPatterns: Array<[RegExp, number]> = [
    [/^(le premier|la première|1|le 1|la 1|le n[°o]1)$/, 0],
    [/^(le deuxi[eè]me|la deuxi[eè]me|2|le 2|la 2|le n[°o]2)$/, 1],
    [/^(le troisi[eè]me|la troisi[eè]me|3|le 3|la 3|le n[°o]3)$/, 2],
  ];
  for (const [pattern, index] of indexPatterns) {
    if (pattern.test(t) && tasks[index]) {
      return [tasks[index]];
    }
  }
  return null;
}

/**
 * Affiche l'indicateur « en train d'écrire… » dans Telegram pendant que le bot
 * réfléchit. L'action expire après 5 s côté Telegram : on la rafraîchit donc
 * toutes les ~4 s jusqu'à l'appel de la fonction d'arrêt retournée.
 */
function startTyping(ctx: BotContextType): () => void {
  void ctx.replyWithChatAction("typing").catch(() => {});
  const interval = setInterval(() => {
    void ctx.replyWithChatAction("typing").catch(() => {});
  }, 4000);
  return () => clearInterval(interval);
}

function buildNavKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("📅 Aujourd'hui", "nav:today")
    .text("📆 Demain", "nav:tomorrow")
    .row()
    .text("🗗 Semaine", "nav:week")
    .text("🗓 Mois", "nav:month")
    .text("📋 Tout", "nav:all");
}

export function createBot(services: AppServices): Bot<BotContextType> {
  const bot = new Bot<BotContextType>(env.TELEGRAM_BOT_TOKEN);

  bot.use(
    session({
      initial: (): SessionData => ({ history: [] }),
      storage: new PrismaSessionStorage<SessionData>(),
    })
  );

  bot.use(async (ctx, next) => {
    ctx.appServices = services;
    if (ctx.from) {
      ctx.appContext = await resolveBotContext(
        services,
        BigInt(ctx.from.id)
      );
    }
    await next();
  });

  bot.command("start", async (ctx) => {
    await ctx.reply(services.responseService.formatWelcome(), {
      reply_markup: buildNavKeyboard(),
    });
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(services.responseService.formatHelp());
  });

  bot.command("today", async (ctx) => {
    if (!ctx.appContext) return;
    const result = await services.taskService.listToday(
      ctx.appContext.userId,
      ctx.appContext.timezone
    );
    await ctx.reply(
      services.responseService.format(result, ctx.appContext.timezone),
      { parse_mode: "HTML", reply_markup: buildNavKeyboard() }
    );
  });

  bot.command("tomorrow", async (ctx) => {
    if (!ctx.appContext) return;
    const result = await services.taskService.listTomorrow(
      ctx.appContext.userId,
      ctx.appContext.timezone
    );
    await ctx.reply(
      services.responseService.format(result, ctx.appContext.timezone),
      { parse_mode: "HTML", reply_markup: buildNavKeyboard() }
    );
  });

  bot.command("week", async (ctx) => {
    if (!ctx.appContext) return;
    const result = await services.taskService.listWeek(
      ctx.appContext.userId,
      ctx.appContext.timezone
    );
    const body = services.responseService.format(result, ctx.appContext.timezone);
    await ctx.reply(`📆 <b>Semaine</b>\n\n${body}`, {
      parse_mode: "HTML",
      reply_markup: buildNavKeyboard(),
    });
  });

  bot.command("month", async (ctx) => {
    if (!ctx.appContext) return;
    const result = await services.taskService.listMonth(
      ctx.appContext.userId,
      ctx.appContext.timezone
    );
    const body = services.responseService.format(result, ctx.appContext.timezone);
    await ctx.reply(`🗓 <b>Mois</b>\n\n${body}`, {
      parse_mode: "HTML",
      reply_markup: buildNavKeyboard(),
    });
  });

  bot.command("tasks", async (ctx) => {
    if (!ctx.appContext) return;
    const result = await services.taskService.listAll(ctx.appContext.userId);
    await ctx.reply(
      services.responseService.format(result, ctx.appContext.timezone),
      { parse_mode: "HTML", reply_markup: buildNavKeyboard() }
    );
  });

  bot.command("done", async (ctx) => {
    if (!ctx.appContext) return;

    const taskId = extractTaskIdFromReply(ctx);
    let result;

    if (taskId) {
      result = await services.taskService.markDone(
        ctx.appContext.userId,
        taskId
      );
    } else if (ctx.session.lastTaskId) {
      result = await services.taskService.markDone(
        ctx.appContext.userId,
        ctx.session.lastTaskId
      );
    } else {
      await ctx.reply(
        "Réponds à un message de tâche avec /done, ou dis-moi laquelle marquer comme terminée."
      );
      return;
    }

    await ctx.reply(
      services.responseService.format(result, ctx.appContext.timezone)
    );
  });

  bot.command("delete", async (ctx) => {
    if (!ctx.appContext) return;

    const taskId = extractTaskIdFromReply(ctx);
    let result;

    if (taskId) {
      const task = await services.taskRepository.findById(
        taskId,
        ctx.appContext.userId
      );
      if (task) {
        result = await services.taskService.deleteFromIntent(
          ctx.appContext.userId,
          task.title
        );
      } else {
        result = { type: "task_not_found" as const };
      }
    } else {
      await ctx.reply(
        "Réponds à un message de tâche avec /delete, ou dis-moi laquelle supprimer."
      );
      return;
    }

    await ctx.reply(
      services.responseService.format(result, ctx.appContext.timezone)
    );
  });

  // Inline keyboard navigation callbacks
  bot.callbackQuery("nav:today", async (ctx) => {
    if (!ctx.appContext) return;
    await ctx.answerCallbackQuery();
    const result = await services.taskService.listToday(
      ctx.appContext.userId,
      ctx.appContext.timezone
    );
    await ctx.reply(
      services.responseService.format(result, ctx.appContext.timezone),
      { parse_mode: "HTML", reply_markup: buildNavKeyboard() }
    );
  });

  bot.callbackQuery("nav:tomorrow", async (ctx) => {
    if (!ctx.appContext) return;
    await ctx.answerCallbackQuery();
    const result = await services.taskService.listTomorrow(
      ctx.appContext.userId,
      ctx.appContext.timezone
    );
    const body = services.responseService.format(result, ctx.appContext.timezone);
    await ctx.reply(`📆 <b>Demain</b>\n\n${body}`, {
      parse_mode: "HTML",
      reply_markup: buildNavKeyboard(),
    });
  });

  bot.callbackQuery("nav:week", async (ctx) => {
    if (!ctx.appContext) return;
    await ctx.answerCallbackQuery();
    const result = await services.taskService.listWeek(
      ctx.appContext.userId,
      ctx.appContext.timezone
    );
    const body = services.responseService.format(result, ctx.appContext.timezone);
    await ctx.reply(`📆 <b>Semaine</b>\n\n${body}`, {
      parse_mode: "HTML",
      reply_markup: buildNavKeyboard(),
    });
  });

  bot.callbackQuery("nav:month", async (ctx) => {
    if (!ctx.appContext) return;
    await ctx.answerCallbackQuery();
    const result = await services.taskService.listMonth(
      ctx.appContext.userId,
      ctx.appContext.timezone
    );
    const body = services.responseService.format(result, ctx.appContext.timezone);
    await ctx.reply(`🗓 <b>Mois</b>\n\n${body}`, {
      parse_mode: "HTML",
      reply_markup: buildNavKeyboard(),
    });
  });

  bot.callbackQuery("nav:all", async (ctx) => {
    if (!ctx.appContext) return;
    await ctx.answerCallbackQuery();
    const result = await services.taskService.listAll(ctx.appContext.userId);
    const body = services.responseService.format(result, ctx.appContext.timezone);
    await ctx.reply(`📋 <b>Toutes les tâches</b>\n\n${body}`, {
      parse_mode: "HTML",
      reply_markup: buildNavKeyboard(),
    });
  });

  bot.on("message:text", async (ctx) => {
    if (!ctx.appContext) return;

    const text = ctx.message.text.trim();
    if (text.startsWith("/")) {
      return;
    }

    await handleUserText(ctx, services, text);
  });

  // Messages vocaux et fichiers audio : on transcrit puis on traite comme du texte.
  bot.on(["message:voice", "message:audio"], async (ctx) => {
    if (!ctx.appContext) return;

    const stopTyping = startTyping(ctx);
    let text: string;
    try {
      const audio = await downloadTelegramFile(ctx);
      text = (await services.mistralService.transcribeAudio(audio)).trim();
    } catch (error) {
      stopTyping();
      console.error("Voice transcription failed:", error);
      await ctx.reply(
        "Désolé, je n'ai pas réussi à comprendre ton message vocal. Tu peux réessayer ou l'écrire ?"
      );
      return;
    }
    stopTyping();

    if (!text) {
      await ctx.reply(
        "Je n'ai rien entendu dans ce vocal. Tu peux réessayer ?"
      );
      return;
    }

    // On confirme ce qui a été compris, puis on traite la transcription.
    await ctx.reply(`🎙 « ${text} »`);
    await handleUserText(ctx, services, text);
  });

  return bot;
}

/**
 * Télécharge le contenu binaire du message vocal/audio courant depuis l'API
 * Telegram (récupération de `file_path` puis fetch du fichier).
 */
async function downloadTelegramFile(ctx: BotContextType): Promise<Uint8Array> {
  const file = await ctx.getFile();
  if (!file.file_path) {
    throw new Error("Fichier Telegram sans file_path");
  }
  const url = `https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Téléchargement du fichier échoué: ${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

/**
 * Traite un message texte de l'utilisateur (qu'il provienne d'un message texte
 * ou de la transcription d'un vocal) : désambiguïsation en attente, parsing
 * d'intention via Mistral, routage et réponse.
 */
async function handleUserText(
  ctx: BotContextType,
  services: AppServices,
  text: string
): Promise<void> {
  if (!ctx.appContext) return;

  const stopTyping = startTyping(ctx);
  try {
    // --- Résolution de désambiguïsation en attente ---
    if (ctx.session.pendingAmbiguous) {
      const { action, tasks, intent } = ctx.session.pendingAmbiguous;
      const selected = resolveDisambiguation(text, tasks);

      if (selected !== null) {
        ctx.session.pendingAmbiguous = undefined;
        let result;

        if (action === "delete") {
          result = await services.taskService.deleteMultiple(ctx.appContext.userId, selected);
        } else if (action === "complete") {
          result = await services.taskService.markDoneMultiple(ctx.appContext.userId, selected);
        } else {
          // update : on applique l'intent sur la première tâche sélectionnée
          result = await services.taskService.markDone(ctx.appContext.userId, selected[0].id);
        }

        const responseText = services.responseService.format(result, ctx.appContext.timezone);
        pushHistory(ctx.session, text, responseText);
        await ctx.reply(responseText);
        return;
      }

      // Message non reconnu comme sélection → on efface l'état et on continue normalement
      ctx.session.pendingAmbiguous = undefined;
    }

    // --- Parsing d'intention via Mistral avec historique ---
    const intent = await services.mistralService.parseIntent(
      text,
      ctx.appContext.timezone,
      ctx.session.history
    );

    if (intent.timezone && intent.intent === "set_timezone") {
      const tzResult = await services.userService.updateTimezone(
        ctx.appContext.userId,
        intent.timezone
      );
      if (tzResult.type === "timezone_updated") {
        ctx.appContext.timezone = intent.timezone;
      }
      const responseText = services.responseService.format(tzResult, ctx.appContext.timezone);
      pushHistory(ctx.session, text, responseText);
      await ctx.reply(responseText);
      return;
    }

    const result = await services.intentRouter.route(intent, ctx.appContext);

    if (result.task) {
      ctx.session.lastTaskId = result.task.id;
    }

    // Mémoriser l'état ambigu pour la désambiguïsation au prochain message
    if (result.type === "ambiguous_task" && result.tasks) {
      const action = intent.intent === "delete_task"
        ? "delete"
        : intent.intent === "complete_task"
        ? "complete"
        : "update";
      ctx.session.pendingAmbiguous = { action, tasks: result.tasks, intent };
    }

    const isListResult = result.type === "task_list" || result.type === "tasks_created";

    const responseText = services.responseService.format(result, ctx.appContext.timezone);
    pushHistory(ctx.session, text, responseText);

    await ctx.reply(
      responseText,
      isListResult
        ? { parse_mode: "HTML", reply_markup: buildNavKeyboard() }
        : {}
    );
  } finally {
    stopTyping();
  }
}
