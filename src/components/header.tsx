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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Send className="h-4 w-4" />
          </span>
          <span className="text-lg">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="#fonctionnement" className="transition-colors hover:text-foreground">
            {t.nav.how}
          </Link>
          <Link href="#fonctionnalites" className="transition-colors hover:text-foreground">
            {t.nav.features}
          </Link>
          <Link href="#exemples" className="transition-colors hover:text-foreground">
            {t.nav.examples}
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
    </header>
  );
}
