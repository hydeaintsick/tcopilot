import { z } from "zod";
import { TaskPeriod, TaskPriority } from "@prisma/client";

export const INTENT_TYPES = [
  "create_task",
  "create_reminder",
  "create_appointment",
  "list_tasks",
  "list_today",
  "list_tomorrow",
  "list_week",
  "list_month",
  "update_task",
  "delete_task",
  "complete_task",
  "set_timezone",
  "unknown",
] as const;

export type IntentType = (typeof INTENT_TYPES)[number];

export const taskItemSchema = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable(),
  period: z.nativeEnum(TaskPeriod).nullable(),
  priority: z.nativeEnum(TaskPriority).nullable(),
});

export type TaskItem = z.infer<typeof taskItemSchema>;

export const parsedIntentSchema = z.object({
  intent: z.enum(INTENT_TYPES),
  title: z.string().nullable(),
  description: z.string().nullable(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable(),
  period: z.nativeEnum(TaskPeriod).nullable(),
  priority: z.nativeEnum(TaskPriority).nullable(),
  taskReference: z.string().nullable(),
  timezone: z.string().nullable(),
  tasks: z.array(taskItemSchema).nullable().optional(),
});

export type ParsedIntent = z.infer<typeof parsedIntentSchema>;

export type ActionResultType =
  | "task_created"
  | "tasks_created"
  | "task_updated"
  | "task_deleted"
  | "tasks_deleted"
  | "task_done"
  | "tasks_done"
  | "task_list"
  | "timezone_updated"
  | "ambiguous_task"
  | "task_not_found"
  | "unknown"
  | "error";

export interface ActionResult {
  type: ActionResultType;
  message?: string;
  tasks?: TaskSummary[];
  task?: TaskSummary;
}

export interface TaskSummary {
  id: string;
  displayId: number | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  date: string | null;
  time: string | null;
  period: string | null;
}

export interface BotContext {
  userId: string;
  telegramUserId: bigint;
  timezone: string;
  isAdmin: boolean;
  hasPremium: boolean;
  isWhitelisted: boolean;
  subscriptionExpiresAt: Date | null;
  trialEndsAt: Date | null;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PendingAmbiguous {
  action: "delete" | "complete" | "update";
  tasks: TaskSummary[];
  intent: ParsedIntent;
}
