const TELEGRAM_BOT_URL = "https://t.me/mypersonalcopilot_bot";

export const siteConfig = {
  name: "TCopilot",
  description:
    "Ton copilote personnel sur Telegram : crée des tâches, des rappels et des rendez-vous en langage naturel, en français.",
  telegramUrl: TELEGRAM_BOT_URL,
  channelUrl: TELEGRAM_BOT_URL,
} as const;
