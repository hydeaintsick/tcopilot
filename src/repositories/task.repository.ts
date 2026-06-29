import type { Task, TaskPeriod, TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { formatDateInTimezone } from "../utils/date.utils";

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

  async findTodoByUser(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { userId, status: "TODO" },
      orderBy: [{ date: "asc" }, { createdAt: "asc" }],
    });
  }

  async findTodoByDate(
    userId: string,
    dateStr: string,
    timezone: string
  ): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        status: "TODO",
        date: { not: null },
      },
      orderBy: [{ time: "asc" }, { period: "asc" }, { createdAt: "asc" }],
    });

    return tasks.filter((task) => {
      if (!task.date) return false;
      return formatDateInTimezone(task.date, timezone) === dateStr;
    });
  }

  async findTodoByDateRange(
    userId: string,
    startDateStr: string,
    endDateStr: string,
    timezone: string
  ): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        status: "TODO",
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
