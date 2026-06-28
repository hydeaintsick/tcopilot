import type { User } from "@prisma/client";
import { env } from "../config/env";
import type { UserRepository } from "../repositories/user.repository";

/** Telegram n'autorise actuellement qu'une seule période : 30 jours. */
export const SUBSCRIPTION_PERIOD_SECONDS = 2592000;
/** Identifiant transmis dans la facture puis renvoyé par Telegram au paiement. */
export const SUBSCRIPTION_PAYLOAD = "tcopilot:subscription:monthly";

export interface InvoiceParams {
  title: string;
  description: string;
  payload: string;
  currency: string;
  prices: { label: string; amount: number }[];
  subscriptionPeriod: number;
}

export interface PremiumStatus {
  hasAccess: boolean;
  reason: "whitelist" | "subscription" | "trial" | "none";
  expiresAt: Date | null;
}

export class SubscriptionService {
  constructor(private readonly userRepository: UserRepository) {}

  get priceInStars(): number {
    return env.STARS_PRICE;
  }

  /** Détermine l'état d'accès premium d'un utilisateur (hors privilège admin). */
  getStatus(user: {
    isWhitelisted: boolean;
    subscriptionExpiresAt: Date | null;
    trialEndsAt: Date | null;
  }): PremiumStatus {
    const now = Date.now();

    if (user.isWhitelisted) {
      return { hasAccess: true, reason: "whitelist", expiresAt: null };
    }
    if (user.subscriptionExpiresAt && user.subscriptionExpiresAt.getTime() > now) {
      return {
        hasAccess: true,
        reason: "subscription",
        expiresAt: user.subscriptionExpiresAt,
      };
    }
    if (user.trialEndsAt && user.trialEndsAt.getTime() > now) {
      return { hasAccess: true, reason: "trial", expiresAt: user.trialEndsAt };
    }
    return { hasAccess: false, reason: "none", expiresAt: null };
  }

  buildInvoiceParams(): InvoiceParams {
    return {
      title: "TCopilot Premium",
      description:
        "Abonnement mensuel à TCopilot, ton assistant personnel sur Telegram. " +
        "Renouvellement automatique chaque mois, annulable à tout moment dans Telegram.",
      payload: SUBSCRIPTION_PAYLOAD,
      currency: "XTR",
      prices: [{ label: "TCopilot Premium (1 mois)", amount: this.priceInStars }],
      subscriptionPeriod: SUBSCRIPTION_PERIOD_SECONDS,
    };
  }

  /**
   * Calcule la date d'expiration à partir d'un évènement `successful_payment`.
   * Telegram fournit `subscription_expiration_date` (Unix, en secondes) ; sinon
   * on retombe sur « maintenant + 30 jours ».
   */
  computeExpiry(subscriptionExpirationDate?: number): Date {
    if (subscriptionExpirationDate) {
      return new Date(subscriptionExpirationDate * 1000);
    }
    return new Date(Date.now() + SUBSCRIPTION_PERIOD_SECONDS * 1000);
  }

  async recordPayment(
    userId: string,
    params: {
      subscriptionExpirationDate?: number;
      isRecurring: boolean;
      chargeId?: string | null;
    }
  ): Promise<User> {
    return this.userRepository.setSubscription(userId, {
      expiresAt: this.computeExpiry(params.subscriptionExpirationDate),
      isRecurring: params.isRecurring,
      chargeId: params.chargeId ?? null,
    });
  }

  async grant(telegramUserId: bigint): Promise<User> {
    return this.userRepository.setWhitelist(telegramUserId, true);
  }

  async revoke(telegramUserId: bigint): Promise<User> {
    return this.userRepository.setWhitelist(telegramUserId, false);
  }
}
