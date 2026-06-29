import type { TaskRepository } from "../repositories/task.repository";
import {
  computeReminderAt,
  formatDateInTimezone,
  getTodayInTimezone,
  parseDateString,
} from "../utils/date.utils";

/**
 * Reporte au jour courant toute tâche à faire dont la date est passée, dans le
 * fuseau de son propriétaire. Garantit qu'aucune tâche non terminée ne « tombe »
 * d'un jour à l'autre : elle est systématiquement réinscrite tant qu'elle n'est
 * pas faite. Idempotent : une tâche déjà datée d'aujourd'hui (ou du futur) est
 * ignorée, donc l'exécution répétée du cron ne la déplace pas en boucle.
 * Retourne le nombre de tâches reportées.
 */
export async function rolloverOverdueTasks(
  taskRepository: TaskRepository
): Promise<number> {
  const tasks = await taskRepository.findTodoWithDate();

  let moved = 0;
  for (const task of tasks) {
    if (!task.date) continue;

    const timezone = task.user.timezone;
    const today = getTodayInTimezone(timezone);
    const taskDate = formatDateInTimezone(task.date, timezone);

    // Pas en retard (aujourd'hui ou plus tard) : rien à faire.
    if (taskDate >= today) continue;

    const reminderAt = computeReminderAt({
      date: today,
      time: task.time,
      period: task.period,
      timezone,
    });

    try {
      await taskRepository.rescheduleDate(task.id, parseDateString(today), reminderAt);
      moved++;
    } catch (error) {
      console.error(`Failed to roll over task ${task.id}:`, error);
    }
  }

  return moved;
}
