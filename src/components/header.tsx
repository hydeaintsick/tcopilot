"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelect } from "@/components/language-select";
import { useLanguage } from "@/components/language-provider";
import { siteConfig } from "@/lib/site";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Promo bar */}
      <div className="w-full bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm">
        <span className="hidden sm:inline">🤖 </span>
        <span className="font-semibold">« Votre secrétaire personnelle »</span>
        <span className="mx-1.5 opacity-70">·</span>
        <span>disponible 24h/24, jamais malade, jamais en vacances</span>
        <span className="mx-1.5 opacity-70">·</span>
        <span className="font-bold">seulement 0,99 $ / mois</span>
        <span className="ml-1">😏</span>
      </div>

      {/* Nav */}
      <div className="border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Send className="h-4 w-4" />
            </span>
            <span className="text-lg">{siteConfig.name}</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link
              href="/#fonctionnement"
              className="transition-colors hover:text-foreground"
            >
              {t.nav.how}
            </Link>
            <Link
              href="/#fonctionnalites"
              className="transition-colors hover:text-foreground"
            >
              {t.nav.features}
            </Link>
            <Link
              href="/#commandes"
              className="transition-colors hover:text-foreground"
            >
              {t.nav.commands}
            </Link>
            <Link
              href="/#exemples"
              className="transition-colors hover:text-foreground"
            >
              {t.nav.examples}
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground"
            >
              {t.nav.contact}
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSelect />
            <ThemeToggle />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href={siteConfig.channelUrl} target="_blank" rel="noreferrer">
                {t.openTelegram}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
