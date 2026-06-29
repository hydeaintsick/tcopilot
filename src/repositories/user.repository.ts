import type { User } from "@prisma/client";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { resolveLanguage } from "../lib/i18n";

export interface SubscriptionUpdate {
  expiresAt: Date;
  isRecurring: boolean;
  chargeId?: string | null;
}

export class UserRepository {
  async findOrCreateByTelegramId(
    telegramUserId: bigint,
    languageCode?: string | null
  ): Promise<User> {
    const existing = await prisma.user.findUnique({
      where: { telegramUserId },
    });

    if (existing) {
      return existing;
    }

    const trialDays = env.FREE_TRIAL_DAYS;
    const trialEndsAt =
      trialDays > 0
        ? new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000)
        : null;

    // Langue initiale : on s'aligne sur celle de Telegram si elle fait partie
    // des langues supportées, sinon repli sur l'anglais (défaut).
    const language = resolveLanguage(languageCode);

    return prisma.user.create({
      data: { telegramUserId, trialEndsAt, language },
    });
  }

  async updateLanguage(userId: string, language: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { language },
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

  /**
   * Incrémente atomiquement le compteur de tâches de l'utilisateur et renvoie la
   * nouvelle valeur, utilisée comme identifiant lisible (#1, #2, ...).
   */
  async nextTaskSeq(userId: string): Promise<number> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { taskSeq: { increment: 1 } },
    });
    return user.taskSeq;
  }

  /** Accorde (ou retire) l'accès premium gratuit à vie via l'identifiant Telegram. */
  async setWhitelist(
    telegramUserId: bigint,
    isWhitelisted: boolean
  ): Promise<User> {
    const trialDays = env.FREE_TRIAL_DAYS;
    const trialEndsAt =
      trialDays > 0
        ? new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000)
        : null;

    return prisma.user.upsert({
      where: { telegramUserId },
      create: { telegramUserId, isWhitelisted, trialEndsAt },
      update: { isWhitelisted },
    });
  }

  async setSubscription(
    userId: string,
    data: SubscriptionUpdate
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionExpiresAt: data.expiresAt,
        subscriptionIsRecurring: data.isRecurring,
        ...(data.chargeId !== undefined
          ? { subscriptionChargeId: data.chargeId }
          : {}),
      },
    });
  }
}
