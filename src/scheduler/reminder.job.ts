import type { Api, RawApi } from "grammy";
import type { TaskRepository } from "../repositories/task.repository";
import { getBotDict } from "../i18n/bot-messages";

type TelegramApi = Pick<Api<RawApi>, "sendMessage">;

/**
 * Sends reminders for all tasks whose `reminderAt` is due and not yet notified.
 * Designed to be invoked periodically by an external cron hitting the API route.
 * Returns the number of reminders successfully sent.
 */
export async function processDueReminders(
  api: TelegramApi,
  taskRepository: TaskRepository
): Promise<number> {
  const now = new Date();
  const dueTasks = await taskRepository.findDueReminders(now);

  let sent = 0;
  for (const task of dueTasks) {
    try {
      const chatId = Number(task.user.telegramUserId);
      const dict = getBotDict(task.user.language);
      const timeLabel = task.time ? dict.reminderAtTime(task.time) : "";
      await api.sendMessage(chatId, dict.reminderDue(task.title, timeLabel));
      await taskRepository.markNotified(task.id);
      sent++;
    } catch (error) {
      console.error(`Failed to send reminder for task ${task.id}:`, error);
    }
  }

  return sent;
}
