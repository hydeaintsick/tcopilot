import type { QuestionLog } from "@prisma/client";
import { prisma } from "../config/prisma";

export interface QuestionLogInput {
  userId?: string | null;
  telegramUserId: bigint;
  text: string;
  source: "text" | "voice";
  intent: string;
  understood: boolean;
}

export class QuestionLogRepository {
  async create(data: QuestionLogInput): Promise<QuestionLog> {
    return prisma.questionLog.create({
      data: {
        userId: data.userId ?? null,
        telegramUserId: data.telegramUserId,
        text: data.text,
        source: data.source,
        intent: data.intent,
        understood: data.understood,
      },
    });
  }
}
