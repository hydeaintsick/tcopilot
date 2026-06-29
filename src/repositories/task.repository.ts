import { TaskStatus } from "@prisma/client";
import type { Task, TaskPeriod, TaskPriority } from "@prisma/client";
import { prisma } from "../config/prisma";
import { formatDateInTimezone } from "../utils/date.utils";

/** Statuts affichés dans les listes : on conserve les tâches faites (✅) pour montrer l'évolution. */
const VISIBLE_STATUSES = [TaskStatus.TODO, TaskStatus.DONE];

export interface CreateTaskData {
  userId: string;
  displayId?: number | null;
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  date?: Date | null;
  time?: string | null;
  period?: TaskPeriod | null;
  reminderAt?: Date | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  date?: Date | null;
  time?: string | null;
  period?: TaskPeriod | null;
  reminderAt?: Date | null;
  status?: TaskStatus;
  notifiedAt?: Date | null;
}

export class TaskRepository {
  async create(data: CreateTaskData): Promise<Task> {
    return prisma.task.create({ data });
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    return prisma.task.findFirst({
      where: { id, userId },
    });
  }

  /** Recherche une tâche via son identifiant lisible (#1, #2, ...) propre à l'utilisateur. */
  async findByDisplayId(
    userId: string,
    displayId: number
  ): Promise<Task | null> {
    return prisma.task.findFirst({
      where: { userId, displayId },
    });
  }

  /** Tâches actives uniquement (TODO). Sert à l'appariement (complétion/suppression/modif). */
  async findTodoByUser(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { userId, status: TaskStatus.TODO },
      orderBy: [{ date: "asc" }, { createdAt: "asc" }],
    });
  }

  /** Tâches affichées dans les listes (à faire + faites) pour rendre la checklist. */
  async findVisibleByUser(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { userId, status: { in: VISIBLE_STATUSES } },
      orderBy: [{ date: "asc" }, { createdAt: "asc" }],
    });
  }

  async findVisibleByDate(
    userId: string,
    dateStr: string,
    timezone: string
  ): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        status: { in: VISIBLE_STATUSES },
        date: { not: null },
      },
      orderBy: [{ time: "asc" }, { period: "asc" }, { createdAt: "asc" }],
    });

    return tasks.filter((task) => {
      if (!task.date) return false;
      return formatDateInTimezone(task.date, timezone) === dateStr;
    });
  }

  async findVisibleByDateRange(
    userId: string,
    startDateStr: string,
    endDateStr: string,
    timezone: string
  ): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        status: { in: VISIBLE_STATUSES },
        date: { not: null },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }, { period: "asc" }, { createdAt: "asc" }],
    });

    return tasks.filter((task) => {
      if (!task.date) return false;
      const d = formatDateInTimezone(task.date, timezone);
      return d >= startDateStr && d <= endDateStr;
    });
  }

  /**
   * Toutes les tâches à faire ayant une date, avec le fuseau de leur propriétaire.
   * Utilisé par le report quotidien des tâches non terminées au lendemain.
   */
  async findTodoWithDate(): Promise<(Task & { user: { timezone: string } })[]> {
    return prisma.task.findMany({
      where: { status: TaskStatus.TODO, date: { not: null } },
      include: { user: { select: { timezone: true } } },
    });
  }

  /** Replanifie une tâche à une nouvelle date et réarme son rappel. */
  async rescheduleDate(
    id: string,
    date: Date,
    reminderAt: Date | null
  ): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data: { date, reminderAt, notifiedAt: null },
    });
  }

  async update(id: string, userId: string, data: UpdateTaskData): Promise<Task> {
    return prisma.task.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Task> {
    return prisma.task.delete({
      where: { id, userId },
    });
  }

  async findDueReminders(
    now: Date
  ): Promise<(Task & { user: { telegramUserId: bigint; language: string } })[]> {
    return prisma.task.findMany({
      where: {
        status: "TODO",
        reminderAt: { lte: now },
        notifiedAt: null,
      },
      include: {
        user: { select: { telegramUserId: true, language: true } },
      },
    });
  }

  async markNotified(id: string): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data: { notifiedAt: new Date() },
    });
  }
}
