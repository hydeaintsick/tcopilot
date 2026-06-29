import type { ActionResult, BotContext, ParsedIntent } from "../types/intent";
import { TaskService } from "./task.service";
import { UserService } from "./user.service";

export class IntentRouterService {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService
  ) {}

  async route(intent: ParsedIntent, context: BotContext): Promise<ActionResult> {
    const { userId, timezone } = context;

    switch (intent.intent) {
      case "create_task":
      case "create_reminder":
      case "create_appointment":
        if (intent.tasks && intent.tasks.length > 1) {
          return this.taskService.createMultipleFromIntent(userId, intent.tasks, timezone);
        }
        if (intent.tasks && intent.tasks.length === 1) {
          // Mistral may put everything inside tasks[0] even for a single task
          const item = intent.tasks[0];
          return this.taskService.createFromIntent(userId, {
            ...intent,
            title: item.title ?? intent.title,
            description: item.description ?? intent.description,
            date: item.date ?? intent.date,
            time: item.time ?? intent.time,
            period: item.period ?? intent.period,
            priority: item.priority ?? intent.priority,
          }, timezone);
        }
        return this.taskService.createFromIntent(userId, intent, timezone);

      case "list_tasks":
        return this.taskService.listAll(userId);

      case "list_today":
        return this.taskService.listToday(userId, timezone);

      case "list_tomorrow":
        return this.taskService.listTomorrow(userId, timezone);

      case "list_week":
        return this.taskService.listWeek(userId, timezone);

      case "list_month":
        return this.taskService.listMonth(userId, timezone);

      case "update_task":
        return this.taskService.updateFromIntent(userId, intent, timezone);

      case "delete_task":
        return this.taskService.deleteFromIntent(userId, intent.taskReference);

      case "complete_task":
        return this.taskService.markDoneByReference(userId, intent.taskReference);

      case "set_timezone":
        if (!intent.timezone) {
          return {
            type: "error",
            code: "timezone_missing",
          };
        }
        return this.userService.updateTimezone(userId, intent.timezone);

      case "unknown":
        return { type: "unknown" };

      default:
        return { type: "unknown" };
    }
  }
}
