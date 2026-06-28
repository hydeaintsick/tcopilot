import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "grammy"],
  outputFileTracingIncludes: {
    "/api/telegram/webhook": ["./node_modules/.prisma/client/**/*"],
    "/api/cron/reminders": ["./node_modules/.prisma/client/**/*"],
  },
};

export default nextConfig;
