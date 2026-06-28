"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { LANGUAGES, type Language } from "@/lib/i18n";

export function LanguageSelect() {
  const { lang, setLang } = useLanguage();

  return (
    <label
      className="relative inline-flex h-10 items-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Change language"
    >
      <Languages className="pointer-events-none absolute left-2.5 h-4 w-4" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Language)}
        className="h-10 cursor-pointer appearance-none rounded-md bg-transparent py-2 pl-8 pr-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="text-foreground">
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
