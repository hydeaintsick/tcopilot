import { TaskPriority, TaskStatus, type Task } from "@prisma/client";
import { TaskRepository } from "../repositories/task.repository";
import { UserRepository } from "../repositories/user.repository";
import type { ActionResult, ParsedIntent, TaskItem, TaskSummary } from "../types/intent";
import {
  addDaysToDateString,
  computeReminderAt,
  getTodayInTimezone,
  parseDateString,
  taskToSummary,
} from "../utils/date.utils";
import { rankByReference } from "../utils/text-match.utils";
import { resolvePriority } from "./user.service";

/** Extrait un identifiant lisible (#3, "3", " 3 ") d'une chaîne, sinon null. */
function parseDisplayId(reference: string | null | undefined): number | null {
  if (!reference) return null;
  const match = reference.trim().match(/^#?(\d{1,9})$/);
  return match ? Number(match[1]) : null;
}

export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createFromIntent(
    userId: string,
    intent: ParsedIntent,
    timezone: string
  ): Promise<ActionResult> {
    if (!intent.title) {
      return {
        type: "error",
        code: "no_title",
      };
    }

    const reminderAt = computeReminderAt({
      date: intent.date,
      time: intent.time,
      period: intent.period,
      timezone,
    });

    const displayId = await this.userRepository.nextTaskSeq(userId);

    const task = await this.taskRepository.create({
      userId,
      displayId,
      title: intent.title,
      description: intent.description,
      priority: resolvePriority(intent.priority),
      date: intent.date ? parseDateString(intent.date) : null,
      time: intent.time,
      period: intent.period,
      reminderAt,
    });

    return {
      type: "task_created",
      task: taskToSummary(task),
    };
  }

  async createMultipleFromIntent(
    userId: string,
    items: TaskItem[],
    timezone: string
  ): Promise<ActionResult> {
    const tasks: TaskSummary[] = [];

    // Séquentiel pour que les identifiants lisibles (#1, #2, ...) suivent l'ordre des tâches.
    for (const item of items) {
      if (!item.title) continue;
      const reminderAt = computeReminderAt({
        date: item.date,
        time: item.time,
        period: item.period,
        timezone,
      });
      const displayId = await this.userRepository.nextTaskSeq(userId);
      const task = await this.taskRepository.create({
        userId,
        displayId,
        title: item.title,
        description: item.description,
        priority: resolvePriority(item.priority),
        date: item.date ? parseDateString(item.date) : null,
        time: item.time,
        period: item.period,
        reminderAt,
      });
      tasks.push(taskToSummary(task));
    }

    return {
      type: "tasks_created",
      tasks,
    };
  }

  async listAll(userId: string): Promise<ActionResult> {
    const tasks = await this.taskRepository.findVisibleByUser(userId);
    return {
      type: "task_list",
      tasks: tasks.map(taskToSummary),
    };
  }

  async listToday(userId: string, timezone: string): Promise<ActionResult> {
    const today = getTodayInTimezone(timezone);
    return this.listForDate(userId, today, timezone);
  }

  async listTomorrow(userId: string, timezone: string): Promise<ActionResult> {
    const today = getTodayInTimezone(timezone);
    const tomorrow = addDaysToDateString(today, 1);
    return this.listForDate(userId, tomorrow, timezone);
  }

  async listWeek(userId: string, timezone: string): Promise<ActionResult> {
    const today = getTodayInTimezone(timezone);
    const endOfWeek = addDaysToDateString(today, 6);
    return this.listForDateRange(userId, today, endOfWeek, timezone);
  }

  async listMonth(userId: string, timezone: string): Promise<ActionResult> {
    const today = getTodayInTimezone(timezone);
    const [year, month] = today.split("-").map(Number);
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const endOfMonth = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    return this.listForDateRange(userId, today, endOfMonth, timezone);
  }

  private async listForDateRange(
    userId: string,
    startStr: string,
    endStr: string,
    timezone: string
  ): Promise<ActionResult> {
    const tasks = await this.taskRepository.findVisibleByDateRange(
      userId,
      startStr,
      endStr,
      timezone
    );
    return {
      type: "task_list",
      tasks: tasks.map(taskToSummary),
    };
  }

  private async listForDate(
    userId: string,
    dateStr: string,
    timezone: string
  ): Promise<ActionResult> {
    const tasks = await this.taskRepository.findVisibleByDate(
      userId,
      dateStr,
      timezone
    );

    return {
      type: "task_list",
      tasks: tasks.map(taskToSummary),
    };
  }

  async updateFromIntent(
    userId: string,
    intent: ParsedIntent,
    timezone: string
  ): Promise<ActionResult> {
    const displayId = parseDisplayId(intent.taskReference);
    let task: Task;
    if (displayId !== null) {
      const byId = await this.taskRepository.findByDisplayId(userId, displayId);
      if (!byId) {
        return { type: "task_not_found" };
      }
      task = byId;
    } else {
      const matchResult = await this.findMatchingTask(userId, intent.taskReference);
      if (matchResult.type !== "found") {
        return matchResult;
      }
      task = matchResult.task;
    }

    const newDate = intent.date ?? (task.date ? task.date.toISOString().slice(0, 10) : null);
    const newTime = intent.time !== null ? intent.time : task.time;
    const newPeriod = intent.period !== null ? intent.period : task.period;
    const newTitle = intent.title ?? task.title;

    const reminderAt = computeReminderAt({
      date: newDate,
      time: newTime,
      period: newPeriod,
      timezone,
    });

    const updated = await this.taskRepository.update(task.id, userId, {
      title: newTitle,
      description: intent.description ?? task.description,
      priority: intent.priority ? resolvePriority(intent.priority) : task.priority,
      date: newDate ? parseDateString(newDate) : null,
      time: newTime,
      period: newPeriod,
      reminderAt,
      notifiedAt: null,
    });

    return {
      type: "task_updated",
      task: taskToSummary(updated),
    };
  }

  async deleteFromIntent(
    userId: string,
    taskReference: string | null
  ): Promise<ActionResult> {
    const displayId = parseDisplayId(taskReference);
    if (displayId !== null) {
      return this.deleteByDisplayId(userId, displayId);
    }

    const matchResult = await this.findMatchingTask(userId, taskReference);
    if (matchResult.type !== "found") {
      return matchResult;
    }

    const task = matchResult.task;
    await this.taskRepository.delete(task.id, userId);

    return {
      type: "task_deleted",
      task: taskToSummary(task),
    };
  }

  /** Supprime une tâche via son identifiant lisible (#1, #2, ...). */
  async deleteByDisplayId(
    userId: string,
    displayId: number
  ): Promise<ActionResult> {
    const task = await this.taskRepository.findByDisplayId(userId, displayId);
    if (!task) {
      return { type: "task_not_found" };
    }
    await this.taskRepository.delete(task.id, userId);
    return {
      type: "task_deleted",
      task: taskToSummary(task),
    };
  }

  /** Marque une tâche comme terminée via son identifiant lisible (#1, #2, ...). */
  async markDoneByDisplayId(
    userId: string,
    displayId: number
  ): Promise<ActionResult> {
    const task = await this.taskRepository.findByDisplayId(userId, displayId);
    if (!task) {
      return { type: "task_not_found" };
    }
    return this.markDone(userId, task.id);
  }

  async markDone(userId: string, taskId: string): Promise<ActionResult> {
    const task = await this.taskRepository.findById(taskId, userId);
    if (!task) {
      return { type: "task_not_found" };
    }

    const updated = await this.taskRepository.update(taskId, userId, {
      status: TaskStatus.DONE,
    });

    return {
      type: "task_done",
      task: taskToSummary(updated),
    };
  }

  async markDoneByReference(
    userId: string,
    taskReference: string | null
  ): Promise<ActionResult> {
    const displayId = parseDisplayId(taskReference);
    if (displayId !== null) {
      return this.markDoneByDisplayId(userId, displayId);
    }

    const matchResult = await this.findMatchingTask(userId, taskReference);
    if (matchResult.type !== "found") {
      return matchResult;
    }

    return this.markDone(userId, matchResult.task.id);
  }

  async markDoneMultiple(userId: string, tasks: TaskSummary[]): Promise<ActionResult> {
    const updated = await Promise.all(
      tasks.map((t) => this.taskRepository.update(t.id, userId, { status: TaskStatus.DONE }))
    );
    return {
      type: "tasks_done",
      tasks: updated.map(taskToSummary),
    };
  }

  async deleteMultiple(userId: string, tasks: TaskSummary[]): Promise<ActionResult> {
    await Promise.all(tasks.map((t) => this.taskRepository.delete(t.id, userId)));
    return {
      type: "tasks_deleted",
      tasks,
    };
  }

  private async findMatchingTask(
    userId: string,
    reference: string | null
  ): Promise<{ type: "found"; task: Task } | ActionResult> {
    if (!reference) {
      return { type: "task_not_found" };
    }

    // Appariement souple en mémoire (casse/accents/pluriel/mots parasites) plutôt
    // qu'une simple recherche par sous-chaîne, qui échouait sur des formulations
    // naturelles ("c'est bon pour mes analyses", "ma séance basic fit").
    const tasks = await this.taskRepository.findTodoByUser(userId);
    const matches = rankByReference(reference, tasks);

    if (matches.length === 0) {
      return { type: "task_not_found" };
    }

    if (matches.length > 1) {
      return {
        type: "ambiguous_task",
        tasks: matches.map(taskToSummary),
      };
    }

    return { type: "found", task: matches[0] };
  }
}
