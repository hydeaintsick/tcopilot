import type { StorageAdapter } from "grammy";
import { prisma } from "../config/prisma";

/**
 * Persists grammy session data in MongoDB (via Prisma) so that conversation
 * history and disambiguation state survive across serverless invocations.
 */
export class PrismaSessionStorage<T> implements StorageAdapter<T> {
  async read(key: string): Promise<T | undefined> {
    const row = await prisma.session.findUnique({ where: { key } });
    if (!row) {
      return undefined;
    }
    try {
      return JSON.parse(row.value) as T;
    } catch {
      return undefined;
    }
  }

  async write(key: string, value: T): Promise<void> {
    const data = JSON.stringify(value);
    await prisma.session.upsert({
      where: { key },
      create: { key, value: data },
      update: { value: data },
    });
  }

  async delete(key: string): Promise<void> {
    await prisma.session.deleteMany({ where: { key } });
  }
}
