import { NextResponse } from "next/server";
import type { Update } from "grammy/types";
import { getBotAndServices } from "@/bot/instance";
import { env } from "@/config/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  if (env.WEBHOOK_SECRET) {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (secret !== env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  let update: Update;
  try {
    update = (await req.json()) as Update;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const { bot, ready } = getBotAndServices();
    await ready;
    await bot.handleUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook handling error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
