import { TaskPriority } from "@prisma/client";
import { UserRepository } from "../repositories/user.repository";
import { isValidTimezone } from "../utils/date.utils";
import type { ActionResult } from "../types/intent";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateTimezone(
    userId: string,
    timezone: string
  ): Promise<ActionResult> {
    if (!isValidTimezone(timezone)) {
      return {
        type: "error",
        code: "invalid_timezone",
        message: timezone,
      };
    }

    await this.userRepository.updateTimezone(userId, timezone);

    return {
      type: "timezone_updated",
      message: timezone,
    };
  }

  async updateLanguage(userId: string, language: string): Promise<void> {
    await this.userRepository.updateLanguage(userId, language);
  }
}

export function resolvePriority(
  priority: TaskPriority | null | undefined
): TaskPriority {
  return priority ?? TaskPriority.MEDIUM;
}
