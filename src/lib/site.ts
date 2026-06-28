export const siteConfig = {
  name: "TCopilot",
  description:
    "Ton copilote personnel sur Telegram : crée des tâches, des rappels et des rendez-vous en langage naturel, en français.",
  telegramUrl:
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ??
    "https://t.me/mypersonalcopilot_bot",
  channelUrl:
    process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL ??
    "https://t.me/mypersonalcopilot_bot",
} as const;
