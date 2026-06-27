import type { Api, RawApi } from "grammy";
import cron from "node-cron";
import type { AppServices } from "../config/container.js";
import { TaskRepository } from "../repositories/task.repository.js";

interface TelegramApi {
  api: Pick<Api<RawApi>, "sendMessage">;
}

export class ReminderScheduler {
  private job: cron.ScheduledTask | null = null;

  constructor(
    private readonly bot: TelegramApi,
    private readonly taskRepository: TaskRepository
  ) {}

  start(): void {
    this.job = cron.schedule("* * * * *", async () => {
      await this.processDueReminders();
    });
    console.log("Reminder scheduler started (every minute)");
  }

  stop(): void {
    this.job?.stop();
    this.job = null;
  }

  private async processDueReminders(): Promise<void> {
    const now = new Date();
    const dueTasks = await this.taskRepository.findDueReminders(now);

    for (const task of dueTasks) {
      try {
        const chatId = Number(task.user.telegramUserId);
        const timeLabel = task.time ? ` à ${task.time}` : "";
        await this.bot.api.sendMessage(
          chatId,
          `⏰ Dans 30 min : ${task.title}${timeLabel}`
        );
        await this.taskRepository.markNotified(task.id);
      } catch (error) {
        console.error(`Failed to send reminder for task ${task.id}:`, error);
      }
    }
  }
}

export function createReminderScheduler(
  bot: TelegramApi,
  services: AppServices
): ReminderScheduler {
  return new ReminderScheduler(bot, services.taskRepository);
}
