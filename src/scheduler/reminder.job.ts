import type { Api, RawApi } from "grammy";
import type { TaskRepository } from "../repositories/task.repository";

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
      const timeLabel = task.time ? ` à ${task.time}` : "";
      await api.sendMessage(
        chatId,
        `⏰ Dans 30 min : ${task.title}${timeLabel}`
      );
      await taskRepository.markNotified(task.id);
      sent++;
    } catch (error) {
      console.error(`Failed to send reminder for task ${task.id}:`, error);
    }
  }

  return sent;
}
