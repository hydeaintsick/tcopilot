import type { User } from "@prisma/client";
import { prisma } from "../config/prisma";

export class UserRepository {
  async findOrCreateByTelegramId(telegramUserId: bigint): Promise<User> {
    const existing = await prisma.user.findUnique({
      where: { telegramUserId },
    });

    if (existing) {
      return existing;
    }

    return prisma.user.create({
      data: { telegramUserId },
    });
  }

  async findByTelegramId(telegramUserId: bigint): Promise<User | null> {
    return prisma.user.findUnique({
      where: { telegramUserId },
    });
  }

  async updateTimezone(userId: string, timezone: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { timezone },
    });
  }
}
