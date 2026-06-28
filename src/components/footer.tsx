"use client";

import { useLanguage } from "@/components/language-provider";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. {t.footer.tagline}
        </p>
        <div className="flex items-center gap-6">
          <a
            href={siteConfig.channelUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Telegram
          </a>
          <a
            href="#fonctionnalites"
            className="transition-colors hover:text-foreground"
          >
            {t.footer.features}
          </a>
        </div>
      </div>
    </footer>
  );
}
