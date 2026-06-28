import { NextResponse } from "next/server";
import { getBotAndServices } from "@/bot/instance";
import { processDueReminders } from "@/scheduler/reminder.job";
import { env } from "@/config/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(req: Request): Promise<Response> {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bot, services, ready } = getBotAndServices();
    await ready;
    const sent = await processDueReminders(bot.api, services.taskRepository);
    return NextResponse.json({ ok: true, sent });
  } catch (error) {
    console.error("Cron reminders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request): Promise<Response> {
  return handle(req);
}

export async function POST(req: Request): Promise<Response> {
  return handle(req);
}
